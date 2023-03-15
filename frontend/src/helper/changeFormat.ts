// format teams in correct form
export function changeTeams(teams: any): {name: string; id: string; logo: string;}[] {
    let formattedTeams = []
    for (let team in teams) {
        let newInfo: {name: string; id: string; logo: string} = {name: team, id: teams[team][0], logo: teams[team][1]}
        formattedTeams.push(newInfo);
    }
    return formattedTeams
}

// function for formatting members before sending via API
export function formatMember(memberData: string[]): {player_id: string; name:string; number:string; height:string; position:string; class:string, notes: string} {
    return {
        player_id:memberData[0], 
        name: memberData[1],
        number: memberData[2],
        height: memberData[4],
        position: memberData[3],
        class: memberData[5],
        notes: memberData[6]
    }
}