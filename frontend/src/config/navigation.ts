import { useAppContext} from '../context/appContext';
import { useParams } from 'react-router-dom';


const NavigationItems = (currTeam: any) => {
  const navigationItems: any = {
    sidebar: [
      {
        name: 'Home ',
        to: '/home', 
        text: 'home',
        
      },
      {
        name: 'Teams ',
        to: '/teams', 
        text:'teams'
      },
    ], 
    footer: [],  
    currTeamName: "",
    currTeamInfo: []
  }

  if (currTeam) {
    navigationItems.currTeamName = currTeam.name
    let currTeamInfo = [
      {
        name: 'Manage Roster ',
        to: `/management/${currTeam.id}`, 
        text: 'management',
        
      },
      {
        name: 'View Report ',
        to: `/report/${currTeam.id}`, 
        text:'report'
      },
      {
        name: 'Edit Report ',
        href: `/ShotEntry/${currTeam.id}`, 
        text:'ShotEntry'
      }
    ]
    navigationItems.currTeamInfo = currTeamInfo
  }

  return navigationItems;
}

export default NavigationItems