/* -------------- STAGE 1 ------------ */

//------- 1.a Interaction Code ------ //
navigate('https://stats.espncricinfo.com/ci/engine/records/team/match_results.html?id=14450;type=tournament');

// step4: return url for next stage
let links = parse().matchSummaryLinks;
for(let i of links) { 
  next_stage({url: i}) 
}

//------- 1.b Parser Code ------------//
//Step1: create an array to store all the records
let links = []

//Step2: Selecting all rows we need from target table
const allRows = $('table.ds-scrollbar-hide > tbody > tr');
 
//Step3: Looping through each rows and get the data from the cells(td)
allRows.each((index, element) => {
  const tds = $(element).find('td');
  const rowURL = "https://www.espncricinfo.com" +$(tds[6]).find('a').attr('href');
  links.push(rowURL);
 })

// step4: Finally returning the data
return {
  'matchSummaryLinks': links
};

/* -------------- STAGE 2 ------------ */

//------- 2.a Interaction Code ------ //

navigate(input.url);
collect(parse());

//------- 2.b Parser Code ------------//

var match_flow = $('div').filter(function(){
	return $(this).find('span > span > span').text() === String("Match Flow") 
}).siblings();

team1 = $(match_flow[0]).find('span > span > span').text().replace(' Innings','')
team2 = $(match_flow[1]).find('span > span > span').text().replace(' Innings','')
matchInfo = team1 + ' Vs ' + team2;

var tables = $('div > table.ci-scorecard-table');

//Step2: Selecting all rows we need from target table -- tr
var firstInningRows = $(tables.eq(0)).find('tbody > tr').filter(
	function(index, element){
  		return $(this).find("td").length >= 8
	}
)

var secondInningsRows = $(tables.eq(1)).find('tbody > tr').filter(
	function(index, element){
  		return $(this).find("td").length >= 8
	}
);

//Step3: Looping through each rows and get the data from the cells(td)
var battingSummary = []
firstInningRows.each((index, element) => {
var tds = $(element).find('td');
  battingSummary.push({
	"match": matchInfo,
	"teamInnings": team1,
	"battingPos": index+1,
	"batsmanName": $(tds.eq(0)).find('a > span > span').text().replace(' ', ''),
	"dismissal": $(tds.eq(1)).find('span > span').text(),
	"runs": $(tds.eq(2)).find('strong').text(), 
	"balls": $(tds.eq(3)).text(),
	"4s": $(tds.eq(5)).text(),
	"6s": $(tds.eq(6)).text(),
	"SR": $(tds.eq(7)).text()
  });
});

secondInningsRows.each((index, element) => {
  var tds = $(element).find('td');
  battingSummary.push({
	"match": matchInfo,
	"teamInnings": team2,
	"battingPos": index+1,
	"batsmanName": $(tds.eq(0)).find('a > span > span').text().replace(' ', ''),
	"dismissal": $(tds.eq(1)).find('span > span').text(),
	"runs": $(tds.eq(2)).find('strong').text(), 
	"balls": $(tds.eq(3)).text(),
	"4s": $(tds.eq(5)).text(),
	"6s": $(tds.eq(6)).text(),
	"SR": $(tds.eq(7)).text()
  });
});

// step4: Finally returning the data
return {"battingSummary": battingSummary}
