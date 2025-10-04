import React from 'react'
import Heroslider from '../../components/marketplace/Heroslider'
import Catogorydlider from '../../components/marketplace/Catogoryslider'
import Newlaunch from '../../components/marketplace/Newlaunch'
import Treandingsection from '../../components/marketplace/Treandingsection'
import Upcominglaunch from '../../components/marketplace/Upcominglaunch'
const Marketplace = () => {
  return (
    <div className='pl-22 pt-22'>
<Heroslider/>
<Catogorydlider/>
<Newlaunch/>
<Treandingsection/>
<Upcominglaunch/>
    </div>
  )
}

export default Marketplace