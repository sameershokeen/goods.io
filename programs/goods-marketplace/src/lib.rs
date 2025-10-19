use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer, Mint};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("6WPFP99DmRLp3rD9dQHVhvBccJN4HrdKF21KJCnSHCTs");

#[program]
pub mod goods_marketplace {
    use super::*;

    // Initialize marketplace
    pub fn initialize_marketplace(
        ctx: Context<InitializeMarketplace>,
        fee_percentage: u16,
    ) -> Result<()> {
        require!(fee_percentage <= 1000, MarketplaceError::FeeTooHigh);
        
        let marketplace = &mut ctx.accounts.marketplace;
        marketplace.authority = ctx.accounts.authority.key();
        marketplace.fee_percentage = fee_percentage;
        marketplace.total_listings = 0;
        
        msg!("Marketplace initialized with fee: {}%", fee_percentage as f64 / 100.0);
        Ok(())
    }

    // List NFT for sale
    pub fn list_nft(
        ctx: Context<ListNFT>,
        price: u64,
    ) -> Result<()> {
        require!(price > 0, MarketplaceError::InvalidPrice);

        let listing = &mut ctx.accounts.listing;
        listing.seller = ctx.accounts.seller.key();
        listing.nft_mint = ctx.accounts.nft_mint.key();
        listing.price = price;
        listing.is_active = true;
        listing.listing_type = ListingType::NFT;

        let marketplace = &mut ctx.accounts.marketplace;
        marketplace.total_listings += 1;

        // Transfer NFT to escrow
        let cpi_accounts = Transfer {
            from: ctx.accounts.seller_nft_account.to_account_info(),
            to: ctx.accounts.escrow_nft_account.to_account_info(),
            authority: ctx.accounts.seller.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, 1)?;

        msg!("NFT listed for sale at {} SOL", price as f64 / 1_000_000_000.0);
        Ok(())
    }

    // Buy NFT
    pub fn buy_nft(ctx: Context<BuyNFT>) -> Result<()> {
        let listing = &ctx.accounts.listing;
        require!(listing.is_active, MarketplaceError::ListingNotActive);
        require!(listing.listing_type == ListingType::NFT, MarketplaceError::InvalidListingType);

        let price = listing.price;
        let marketplace = &ctx.accounts.marketplace;
        let fee = (price as u128 * marketplace.fee_percentage as u128 / 10000) as u64;
        let seller_amount = price - fee;

        // Transfer SOL from buyer to seller
        let transfer_ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.buyer.key(),
            &listing.seller,
            seller_amount,
        );
        anchor_lang::solana_program::program::invoke(
            &transfer_ix,
            &[
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.seller_sol_account.to_account_info(),
            ],
        )?;

        // Transfer fee to marketplace authority
        if fee > 0 {
            let fee_transfer_ix = anchor_lang::solana_program::system_instruction::transfer(
                &ctx.accounts.buyer.key(),
                &marketplace.authority,
                fee,
            );
            anchor_lang::solana_program::program::invoke(
                &fee_transfer_ix,
                &[
                    ctx.accounts.buyer.to_account_info(),
                    ctx.accounts.marketplace_authority.to_account_info(),
                ],
            )?;
        }

        // Transfer NFT from escrow to buyer
        let seeds = &[
            b"listing",
            listing.seller.as_ref(),
            listing.nft_mint.as_ref(),
            &[ctx.bumps.listing],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow_nft_account.to_account_info(),
            to: ctx.accounts.buyer_nft_account.to_account_info(),
            authority: ctx.accounts.listing.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, 1)?;

        // Mark listing as inactive
        let listing = &mut ctx.accounts.listing;
        listing.is_active = false;

        msg!("NFT sold for {} SOL", price as f64 / 1_000_000_000.0);
        Ok(())
    }

    // List tokens for sale
    pub fn list_tokens(
        ctx: Context<ListTokens>,
        amount: u64,
        price_per_token: u64,
    ) -> Result<()> {
        require!(amount > 0, MarketplaceError::InvalidAmount);
        require!(price_per_token > 0, MarketplaceError::InvalidPrice);

        let listing = &mut ctx.accounts.listing;
        listing.seller = ctx.accounts.seller.key();
        listing.token_mint = ctx.accounts.token_mint.key();
        listing.amount = amount;
        listing.price_per_token = price_per_token;
        listing.is_active = true;
        listing.listing_type = ListingType::Token;

        let marketplace = &mut ctx.accounts.marketplace;
        marketplace.total_listings += 1;

        // Transfer tokens to escrow
        let cpi_accounts = Transfer {
            from: ctx.accounts.seller_token_account.to_account_info(),
            to: ctx.accounts.escrow_token_account.to_account_info(),
            authority: ctx.accounts.seller.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        msg!("Tokens listed: {} at {} SOL each", amount, price_per_token as f64 / 1_000_000_000.0);
        Ok(())
    }

    // Buy tokens
    pub fn buy_tokens(ctx: Context<BuyTokens>, amount: u64) -> Result<()> {
        let listing = &ctx.accounts.listing;
        require!(listing.is_active, MarketplaceError::ListingNotActive);
        require!(listing.listing_type == ListingType::Token, MarketplaceError::InvalidListingType);
        require!(amount <= listing.amount, MarketplaceError::InsufficientTokens);

        let total_price = (amount as u128 * listing.price_per_token as u128) as u64;
        let marketplace = &ctx.accounts.marketplace;
        let fee = (total_price as u128 * marketplace.fee_percentage as u128 / 10000) as u64;
        let seller_amount = total_price - fee;

        // Transfer SOL from buyer to seller
        let transfer_ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.buyer.key(),
            &listing.seller,
            seller_amount,
        );
        anchor_lang::solana_program::program::invoke(
            &transfer_ix,
            &[
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.seller_sol_account.to_account_info(),
            ],
        )?;

        // Transfer fee to marketplace authority
        if fee > 0 {
            let fee_transfer_ix = anchor_lang::solana_program::system_instruction::transfer(
                &ctx.accounts.buyer.key(),
                &marketplace.authority,
                fee,
            );
            anchor_lang::solana_program::program::invoke(
                &fee_transfer_ix,
                &[
                    ctx.accounts.buyer.to_account_info(),
                    ctx.accounts.marketplace_authority.to_account_info(),
                ],
            )?;
        }

        // Transfer tokens from escrow to buyer
        let seeds = &[
            b"token_listing",
            listing.seller.as_ref(),
            listing.token_mint.as_ref(),
            &[ctx.bumps.listing],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.buyer_token_account.to_account_info(),
            authority: ctx.accounts.listing.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?;

        // Update listing
        let listing = &mut ctx.accounts.listing;
        listing.amount -= amount;
        if listing.amount == 0 {
            listing.is_active = false;
        }

        msg!("Tokens purchased: {} for {} SOL", amount, total_price as f64 / 1_000_000_000.0);
        Ok(())
    }

    // Cancel NFT listing
    pub fn cancel_nft_listing(ctx: Context<CancelNFTListing>) -> Result<()> {
        let listing = &ctx.accounts.listing;
        require!(listing.is_active, MarketplaceError::ListingNotActive);

        // Transfer NFT back to seller
        let seeds = &[
            b"listing",
            listing.seller.as_ref(),
            listing.nft_mint.as_ref(),
            &[ctx.bumps.listing],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow_nft_account.to_account_info(),
            to: ctx.accounts.seller_nft_account.to_account_info(),
            authority: ctx.accounts.listing.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, 1)?;

        // Mark listing as inactive
        let listing = &mut ctx.accounts.listing;
        listing.is_active = false;

        msg!("NFT listing cancelled");
        Ok(())
    }
}

// Account structures
#[derive(Accounts)]
pub struct InitializeMarketplace<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 2 + 8,
        seeds = [b"marketplace"],
        bump
    )]
    pub marketplace: Account<'info, Marketplace>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ListNFT<'info> {
    #[account(
        init,
        payer = seller,
        space = 8 + 32 + 32 + 8 + 1 + 1,
        seeds = [b"listing", seller.key().as_ref(), nft_mint.key().as_ref()],
        bump
    )]
    pub listing: Account<'info, Listing>,
    #[account(mut)]
    pub marketplace: Account<'info, Marketplace>,
    #[account(mut)]
    pub seller: Signer<'info>,
    pub nft_mint: Account<'info, Mint>,
    #[account(mut)]
    pub seller_nft_account: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = seller,
        associated_token::mint = nft_mint,
        associated_token::authority = listing
    )]
    pub escrow_nft_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyNFT<'info> {
    #[account(
        mut,
        seeds = [b"listing", listing.seller.as_ref(), listing.nft_mint.as_ref()],
        bump
    )]
    pub listing: Account<'info, Listing>,
    pub marketplace: Account<'info, Marketplace>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    /// CHECK: Seller SOL account
    #[account(mut)]
    pub seller_sol_account: AccountInfo<'info>,
    /// CHECK: Marketplace authority
    #[account(mut)]
    pub marketplace_authority: AccountInfo<'info>,
    #[account(mut)]
    pub escrow_nft_account: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = listing.nft_mint,
        associated_token::authority = buyer
    )]
    pub buyer_nft_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ListTokens<'info> {
    #[account(
        init,
        payer = seller,
        space = 8 + 32 + 32 + 8 + 8 + 8 + 1 + 1,
        seeds = [b"token_listing", seller.key().as_ref(), token_mint.key().as_ref()],
        bump
    )]
    pub listing: Account<'info, TokenListing>,
    #[account(mut)]
    pub marketplace: Account<'info, Marketplace>,
    #[account(mut)]
    pub seller: Signer<'info>,
    pub token_mint: Account<'info, Mint>,
    #[account(mut)]
    pub seller_token_account: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = seller,
        associated_token::mint = token_mint,
        associated_token::authority = listing
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyTokens<'info> {
    #[account(
        mut,
        seeds = [b"token_listing", listing.seller.as_ref(), listing.token_mint.as_ref()],
        bump
    )]
    pub listing: Account<'info, TokenListing>,
    pub marketplace: Account<'info, Marketplace>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    /// CHECK: Seller SOL account
    #[account(mut)]
    pub seller_sol_account: AccountInfo<'info>,
    /// CHECK: Marketplace authority
    #[account(mut)]
    pub marketplace_authority: AccountInfo<'info>,
    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = listing.token_mint,
        associated_token::authority = buyer
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelNFTListing<'info> {
    #[account(
        mut,
        seeds = [b"listing", seller.key().as_ref(), listing.nft_mint.as_ref()],
        bump,
        has_one = seller
    )]
    pub listing: Account<'info, Listing>,
    #[account(mut)]
    pub seller: Signer<'info>,
    #[account(mut)]
    pub escrow_nft_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub seller_nft_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

// Data structures
#[account]
pub struct Marketplace {
    pub authority: Pubkey,
    pub fee_percentage: u16,
    pub total_listings: u64,
}

#[account]
pub struct Listing {
    pub seller: Pubkey,
    pub nft_mint: Pubkey,
    pub price: u64,
    pub is_active: bool,
    pub listing_type: ListingType,
}

#[account]
pub struct TokenListing {
    pub seller: Pubkey,
    pub token_mint: Pubkey,
    pub amount: u64,
    pub price_per_token: u64,
    pub is_active: bool,
    pub listing_type: ListingType,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ListingType {
    NFT,
    Token,
}

// Errors
#[error_code]
pub enum MarketplaceError {
    #[msg("Fee percentage too high")]
    FeeTooHigh,
    #[msg("Invalid price")]
    InvalidPrice,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Listing not active")]
    ListingNotActive,
    #[msg("Invalid listing type")]
    InvalidListingType,
    #[msg("Insufficient tokens")]
    InsufficientTokens,
}
