// initial navigation side bar
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

  // side bar navigation
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
        name: 'Shot Entry ',
        href: `/ShotEntry/${currTeam.id}`, 
        text:'ShotEntry'
      },
      {
        name: 'Rotations ',
        href: `/Rotations/${currTeam.id}`, 
        text:'Rotations'
      },
    ]
    navigationItems.currTeamInfo = currTeamInfo
  }

  return navigationItems;
}

export default NavigationItems