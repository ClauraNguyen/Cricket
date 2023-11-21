/* -------------- STAGE 1 ------------ */

//------- 1.a Interaction Code ------ //
navigate('https://stats.espncricinfo.com/ci/engine/records/team/match_results.html?id=14450;type=tournament');

let links = parse().playersLinks;
for(let i of links) { 
  next_stage({url: i}) 
}

//------- 1.b Parser Code ------------//
let links = []
const allRows = $('table.ds-scrollbar-hide > tbody > tr');
 	allRows.each((index, element) => {
  	const tds = $(element).find('td');
  	const rowURL = "https://www.espncricinfo.com" +$(tds[6]).find('a').attr('href');
  	links.push(rowURL);
 })
return {
  'playersLinks': links
};

/* -------------- STAGE 2 ------------ */

//------- 2.a Interaction Code ------ //
navigate(input.url);
collect(parse());

//---------- 2.b Parser Code ---------//

//Step0: Take Match Information
var match_flow = $('div').filter(
	function(){ 
		return $(this).find('span > span > span').text() === String("Match Flow") 
	}
).siblings();

team1 = $(match_flow[0]).find('span > span > span').text().replace(' Innings','')
team2 = $(match_flow[1]).find('span > span > span').text().replace(' Innings','')
matchInfo = team1 + ' Vs ' + team2;

//Step1: create an array to store all the records
var tables = $('div > table.ds-table-auto');

//Step2: Selecting all rows we need from target table -- tr
var firstInningRows = $(tables.eq(1)).find('tbody > tr').filter(function(index, element){
  return $(this).find("td").length >= 11
})

var secondInningsRows = $(tables.eq(3)).find('tbody > tr').filter(function(index, element){
  return $(this).find("td").length >= 11
});

//Step3: Looping through each rows and get the data from the cells -- td
var bowlingSummary = []
firstInningRows.each((index, element) => {
  var tds = $(element).find('td');
  bowlingSummary.push({
  		"match": matchInfo,
  		"bowlingTeam": team2,
   		"bowlerName": $(tds.eq(0)).find('a > span').text().replace(' ', ''),
    		"overs": $(tds.eq(1)).text(),
  		"maiden": $(tds.eq(2)).text(), 
  		"runs": $(tds.eq(3)).text(),
  		"wickets": $(tds.eq(4)).text(),
  		"economy": $(tds.eq(5)).text(),
 		"0s": $(tds.eq(6)).text(),
    	"4s": $(tds.eq(7)).text(),
    	"6s": $(tds.eq(8)).text(),
    	"wides": $(tds.eq(9)).text(),
    	"noBalls": $(tds.eq(10)).text()
  });
});

secondInningsRows.each((index, element) => {
  var tds = $(element).find('td');
   bowlingSummary.push({
  		"match": matchInfo,
  		"bowlingTeam": team1,
   		"bowlerName": $(tds.eq(0)).find('a > span').text().replace(' ', ''),
    		"overs": $(tds.eq(1)).text(),
  		"maiden": $(tds.eq(2)).text(), 
  		"runs": $(tds.eq(3)).text(),
  		"wickets": $(tds.eq(4)).text(),
  		"economy": $(tds.eq(5)).text(),
 		"0s": $(tds.eq(6)).text(),
	    	"4s": $(tds.eq(7)).text(),
	    	"6s": $(tds.eq(8)).text(),
	    	"wides": $(tds.eq(9)).text(),
	    	"noBalls": $(tds.eq(10)).text()
  });
});

// step4: Finally returning the data
return {"bowlingSummary": bowlingSummary}

