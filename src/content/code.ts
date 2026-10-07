/**
 * The Journey Further Culture Code: final approved copy.
 * Words here must match the approved brief exactly. Headings can be styled
 * (caps, lettering graphics) but the words must not change.
 * Bold is marked with **double asterisks**.
 */
import type { RichText, ValueId } from "./types";

export type ValueInAction = {
  clients: string;
  people: string;
  dont: string;
};

export type ValueContent = {
  id: ValueId;
  name: string;
  strapline: string;
  intro: RichText[];
  blocks: { heading: string; body: RichText[] }[];
  pullGraphic: string;
  valueInAction: ValueInAction;
};

export const cover = {
  title: "The Journey Further Culture Code",
  statement: [
    "This matters more than your job description.",
    "Great strategy fails without great culture.",
    "This is ours.",
  ],
};

export const whoWeAre = {
  part: "Part 1",
  heading: "Who We Are",
  origin: {
    heading: "The Origin Story",
    body: [
      "In January 2017, a get-together in a Yorkshire pub was the start of something. Three founders - Robin, Chris, and Matt - were tired of watching an industry confuse its clients, hide behind jargon, and mistake complexity for quality. So they decided to do something about it. They built Journey Further to prove a simple truth: that an agency with genuine values, genuinely lived, would succeed.",
      "Journey Further has evolved a lot since that founding get-together, but this core belief hasn't changed. **We know that if we continue to live by our values we will win, and if we don't, we will lose.**",
    ],
  },
  evolution: {
    heading: "The Evolution",
    body: "What started as a small, ambitious team in Leeds became something bigger - not by accident, but because we focused on a values-first approach. We moved to new offices in Leeds three times. We opened in Manchester. Then London. Then New York. We grew our services because our clients trusted us to do more. We brought in new teams, new specialisms, and new voices. We made acquisitions. We had setbacks, but we kept living by our values, and we kept on winning. Every person who joined us along the way is a part of our story.",
  },
  today: {
    heading: "Today",
    body: [
      "We are now around 200 people, across multiple cities and countries, operating in a world that looks nothing like the one we launched in.",
      "Clients choose us because they believe we are the agency that evolves as fast as the world around us, with a team that's always searching for what's new and what's next, never settling and always pushing performance. It is our culture, and our values, that make this true.",
    ],
  },
  values: {
    heading: "Our Values",
    body: "Our values aren't just words on an office wall. They're how we make decisions, how we treat each other, and how we show up every day.",
  },
  obsessive: {
    heading: "Why we are obsessive about this stuff",
    body: "Everything in our industry moves at breakneck speed. Tech changes, platforms shift, and the landscape evolves daily. But the one thing that cannot change is our commitment to who we are. When everything else is unpredictable, our values are our gravity. They keep our feet on the ground. If we lose sight of them, we lose everything.",
  },
};

export const youBelongHere = {
  part: "Part 2",
  heading: "You Belong Here",
  body: [
    "Whoever you are, wherever you joined us from, and wherever you're based - you're part of this. It doesn't matter whether you've been here since the beginning or joined us last week. The founding story is part of our history. You are part of our present and future.",
    "Bring your perspective, bring your background, bring your weirdness. We genuinely need it. **If two of us agree on everything, one of us is unnecessary.** We want every voice heard. Especially the quiet ones.",
  ],
  quote: "If two of us agree on everything, one of us is unnecessary.",
};

export const highStandards = {
  part: "Part 3",
  heading: "High Standards. High Care.",
  body: [
    "We have high expectations. We also have your back. Both of those things are equally true here - and that's not an accident, it's the whole point.",
    "We've learned that people do their best work when they are genuinely cared about, when they feel supported, trusted, and encouraged to bring their whole self to work. So we've built a business that takes that seriously. Care isn't just something the company provides in benefits; it is an everyday expectation of how we treat and protect one another - bringing the right thought, empathy, and care to every interaction.",
    "**Our values aren't passive - they ask something real of every person here, every day. None of that is possible if you're running on empty. We've got you.**",
  ],
  benefitsIntro:
    "That means flexible working and generous holidays. It means Friday Flex every week. It means managers, directors, and a People team that are always available, whatever you're dealing with. It means policies and ways of working that are people-focused and regularly reviewed. And it means private health care for everyone who wants it.",
};

export const howWeSucceed = {
  part: "Part 4",
  heading: "How We Succeed",
  statements: [
    "We succeed by having genuine values, that we genuinely live.",
    "Being Together and Open are our foundation.",
    "Being fiercely Proactive is our edge.",
  ],
  outro: "NEVER SETTLE",
};

export const values: Record<ValueId, ValueContent> = {
  together: {
    id: "together",
    name: "Together",
    strapline: "One Team, Always",
    intro: [
      "Our culture is one of genuine care. We notice when someone is struggling before they say anything. We pull together under pressure without being asked. We break down walls between teams and locations because the best results come from diverse minds focusing on the same problem. That includes our clients - their challenges are our challenges, their success is our success.",
    ],
    blocks: [
      {
        heading: "Humanity and Tech",
        body: [
          'In a world increasingly driven by AI and automation, staying connected takes deliberate effort. "Together" means we have to work twice as hard to build real human relationships, while also learning to collaborate with new tech, including AI. We don\'t fear automation; we partner with it. We test it, play with it and learn as it evolves - creating more opportunity for our people and our clients.',
        ],
      },
      {
        heading: "Deliberate Connection",
        body: [
          "We believe in flexible working, but our best work happens when people are genuinely connected - and that doesn't happen by accident. We invest in creating the spaces, rhythms, and moments that bring people together, whether that's in the office, across locations, or at social events. These moments build the relationships that make everything else work better. We ask everyone to show up for them. Real togetherness requires intention - from us and from you.",
        ],
      },
    ],
    pullGraphic: "We come together under pressure",
    valueInAction: {
      clients:
        "A client pivot is needed urgently. Instead of a chain of fragmented emails, the Creative Director and an analyst get together unprompted. They bring their specialisms to bear on the problem before it even reaches the client's inbox.",
      people:
        "A team member is going through something difficult. Without being asked, teammates reorganise the day's heaviest work to give them space. Not because a manager told them to, but because we protect our own.",
      dont: "Only reaching out to colleagues when you need something from them. Being a ghost when a teammate is clearly struggling. If someone is overwhelmed, stepping in with help and empathy is how we look after each other.",
    },
  },
  open: {
    id: "open",
    name: "Open",
    strapline: "Curious and Candid",
    intro: [
      "Openness is a two-way street. It is the deliberate balance of curiosity and candour. We say what we think with total honesty, but we listen just as fiercely as we challenge. We share what we know, but we actively seek out other perspectives, welcome tough feedback, and change our minds when the evidence suggests we should. No conversation or person is exempt from this standard - it applies across peers, managers, senior leaders, and clients.",
    ],
    blocks: [
      {
        heading: "Curious First, Candid Second",
        body: [
          "You cannot expect honesty from people you do not listen to. Curiosity is our defence against arrogance. Before you challenge, critique, or give feedback, do the hard work of asking questions and learning the context first. Welcome challenge to your own ideas, actively seek feedback on your work, and be big enough to admit when a colleague or client has a better way forward.",
        ],
      },
      {
        heading: "Compassionate Candour",
        body: [
          "We challenge directly because we care deeply. Compassionate candour means pairing high standards with deep empathy. We don't hide uncomfortable truths or sugarcoat performance, but we deliver clarity with kindness, respect, and the intention to help each other grow.",
        ],
      },
      {
        heading: "Truth is Our Starting Point for Performance",
        body: [
          "We are a marketing agency built to drive performance, and you cannot optimise what you do not accurately measure. In an industry that frequently drowns in vanity metrics and spin, our job is to get as close to the unvarnished truth as possible. You must know, understand, and share the exact starting point - no matter how brutal or brilliant - because reality is the only place from which we can optimise and win.",
        ],
      },
      {
        heading: "Permission to Fail",
        body: [
          'This commitment to truth and learning only works if it is psychologically safe to speak up. Being open means you have the explicit permission to put your hand up and say "I\'m drowning" or "I don\'t know how to do this" without fearing you\'ll look stupid. We care infinitely more about how we solve a problem together than finding someone to blame for it.',
        ],
      },
    ],
    pullGraphic: "We challenge directly because we care deeply",
    valueInAction: {
      clients:
        "A new campaign we've launched has delivered the best results the client has ever seen. We don't quietly note it in the next report - we speak to them that afternoon, walk them through exactly what drove it, and use that insight to shape the future of the campaign.",
      people:
        "We've just won a significant new client. Rather than a brief mention in the next company meeting, leadership shares the full story openly - who pitched, what won it, what it means commercially, and what it opens up for the team.",
      dont: "Sending a beautifully formatted monthly report that buries a declining metric on slide fourteen. Digging your heels in and refusing to listen when your team or a client challenges your ideas. Waiting until a client relationship is already damaged before admitting something went wrong.",
    },
  },
  proactive: {
    id: "proactive",
    name: "Proactive",
    strapline: "Make It Happen",
    intro: [
      'We all see things others don\'t. We\'re all capable of great ideas, better solutions, or spotting something that isn\'t working. "Make It Happen" isn\'t just permission to act, it\'s an expectation. That applies in every situation, whether you\'re improving an internal process nobody asked you to fix, or proposing a new idea that the client didn\'t ask for.',
    ],
    blocks: [
      {
        heading: "Active Contribution",
        body: [
          "We back people who try things. Don't stand still when you see a better way forward. We don't want Journey Further to be a place where you just execute someone else's idea - this is a creative, high-performing collective where every voice and effort matters.",
        ],
      },
      {
        heading: "Lead Without Permission",
        body: [
          "You do not need to wait for a promotion to act like a leader. We promise we will always give good ideas the platform, the funding, and the backing they need. Your career growth here is capped only by your own imagination and initiative. If you want to build something that aligns with our vision, the door is wide open.",
        ],
      },
    ],
    pullGraphic: "This isn't permission to act / It's an expectation",
    valueInAction: {
      clients:
        "A client wants a safe campaign built on last year's benchmarks. Instead of taking the order, we show them why the safe route is actually the riskiest path to growth and push for a bolder approach. We lead the client; we don't just serve them.",
      people:
        "A member of the team notices an internal process has become a box-ticking exercise with no real value. Rather than accepting it, they present a solution to the Senior Leadership Team. We don't wait for permission; we just make it better.",
      dont: "Sitting on the sidelines. Being in a meeting with a better idea and saying nothing. Waiting for someone to hand you a to-do list. If you see something that could be improved and choose to say nothing, that's a choice - and it's not one we make here.",
    },
  },
};

export const valueOrder: ValueId[] = ["together", "open", "proactive"];

export const promise = {
  part: "Part 5",
  heading: "The Promise",
  body: [
    "Our mission is to be the most admired and respected agency - the one that other agencies look at and know we're doing something right. The one that clients choose because they trust us, that talent wants to join because of what we stand for, and that our own people are proud to be part of. That's what we're building. Every action, and every decision made by every person in our business, is part of making that real.",
    "Nobody gets this right every time - not individuals, not managers, not senior leaders. We will all, at some point, fall short of the values set out in this code. We didn't create it to pretend otherwise. We created it to set the standard, to give us something to aspire to, and to give us all - everyone, at every level - something to be held accountable to.",
  ],
  toYou: {
    heading: "Our Promise to You",
    items: [
      {
        lead: "We will invest in you:",
        text: "Your development, your progression, and your craft. We'll help you grow further and faster than you thought possible.",
      },
      {
        lead: "We will provide stellar work:",
        text: "You'll work with brilliant clients on work that genuinely matters.",
      },
      {
        lead: "We will give you real autonomy:",
        text: "Not the micro-managed kind, but true ownership.",
      },
      {
        lead: "We will provide a safety net:",
        text: "You'll be part of a team that has your back, challenges you to be better, and celebrates you when you are.",
      },
      {
        lead: "We will unlock opportunities:",
        text: "You'll have access to opportunities to lead, to build, and to try new things.",
      },
      { lead: "We will make Journey Further somewhere you're proud to work.", text: "" },
    ],
  },
  toUs: {
    heading: "Your Promise to Us",
    items: [
      {
        lead: "Show up fully:",
        text: "Bring your ideas, your honesty, and your genuine care for the people around you.",
      },
      {
        lead: "Own the values:",
        text: "Live them not because you're asked to, but because you understand why they matter.",
      },
      {
        lead: "Be a fixer:",
        text: "Be the person who makes things better - for a client, for a colleague, for the agency - without waiting to be asked.",
      },
      { lead: "Speak up:", text: "Challenge what isn't working. Celebrate what is." },
    ],
  },
  closing:
    "If you do that, you won't just leave this place better than you found it. You'll be part of something that the whole industry admires - and you'll know you helped build it.",
};

export const shapeTheCode = {
  part: "Part 6",
  heading: "Shape the Code",
  lead: "This doesn't end here. It starts here.",
  body: [
    "The values only exist in the moments they're lived - the truth told when it would have been easier not to, the colleague supported before they had to ask, the better idea acted on without waiting for permission. Those moments are happening every day. They belong here too.",
    "The most admired agency is built by every person who chooses, every day, to live these values. If you've seen a value in action, tell us. This section will grow with those stories - and prove that our values work.",
  ],
};

export const signOff = "Never settle. Journey further.";
