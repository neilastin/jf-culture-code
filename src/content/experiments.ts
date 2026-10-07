/**
 * Copy for the Experimental ideas page: the Easter eggs hidden on the main
 * site, and ideas that need new content before they can be built.
 */

export const easterEggs: { where: string; how: string; what: string }[] = [
  { where: "Anywhere", how: "Type \"never settle\" (or the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A)", what: "A burst of brand confetti and a sign-off" },
  { where: "The Origin Story", how: "Click the founders' painting", what: "The frame rocks, a toast pops up and the glasses get raised" },
  { where: "High Standards. High Care.", how: "Click either side of the see-saw", what: "It tips under the weight, then springs back level. Both matter equally" },
  { where: "Why we are obsessive", how: "Wait a few seconds, then click a value", what: "Values drift away unless you bring them back down to earth" },
  { where: "Proactive", how: "Flip the light switch six times, fast", what: "Disco mode" },
];

export const ideasNeedingContent: { title: string; idea: string; need: string }[] = [
  {
    title: "Then and now",
    idea: "A drag slider on each office stop of the Evolution timeline, wiping between the first day and today.",
    need: "Early photos of each office (the pub, the first Leeds office, Manchester, London, New York) and matching photos from today.",
  },
  {
    title: "In the founders' words",
    idea: "Tap the pub painting to hear Robin, Chris and Matt tell the origin story in 30 seconds each.",
    need: "Three short voice notes or video clips from the founders, plus written transcripts for accessibility.",
  },
  {
    title: "Values champions",
    idea: "A face on each value: real people nominated by colleagues, rotating each quarter, linked to their stories on the wall.",
    need: "Nominations, photos and permission from the people featured.",
  },
  {
    title: "Your first week, personalised",
    idea: "New joiners land on a version of the Code that greets them by name and shows their team's latest stories.",
    need: "Journey Further SSO, team data from the HR system, and a People team owner.",
  },
  {
    title: "Live wins from the CRM",
    idea: "The Latest wins ticker fills itself from real new business and award news, approved with one click.",
    need: "Agreement on which wins can be shared internally, and an export or webhook from the CRM.",
  },
  {
    title: "The Code, read aloud",
    idea: "A listen-along mode that highlights each line as it's read, for commutes and accessibility.",
    need: "A recorded narration (ideally a colleague's voice) of the approved copy.",
  },
];
