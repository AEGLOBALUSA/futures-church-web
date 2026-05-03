import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What We Believe",
  description:
    "You don’t have to agree with any of this to be welcome on a Sunday. But if you ever wondered what we mean when we say we follow Jesus, this is the long answer.",
  openGraph: {
    title: "What We Believe · Futures Church",
    description: "Seventeen things we keep coming back to. Read what helps, skip what doesn’t.",
  },
};

const ARTICLES: Array<{ title: string; body: string }> = [
  {
    title: "The Word of God",
    body:
      "The Bible is not a suggestion. Not a collection of good ideas. It is the inspired, powerful, and inerrant Word of God. We preach from it every week because we believe it has the power to change your life — not just inform it. It is our foundation, our authority, and our final guide on all matters of faith and life. It is the living Word of God — its truth doesn't expire. It speaks into every season, every situation, and every generation.",
  },
  {
    title: "The Trinity",
    body:
      "We believe in one God who exists eternally in three persons — Father, Son, and Holy Spirit. Equal in nature, distinct in person, unified in purpose. Everything we believe flows from who God is.",
  },
  {
    title: "God the Father",
    body:
      "God the Father is the creator of all things, sovereign over all things, and deeply personal. He is not a distant force. He is a Father who knows you, loves you, and is actively involved in the story of your life.",
  },
  {
    title: "The Lord Jesus Christ",
    body:
      "There is no other name. No other way. No other hope. Jesus — fully God and fully man — was born of a virgin, lived a sinless life, died on the cross as the perfect sacrifice for sin, and rose bodily from the dead on the third day. The resurrection is not a footnote — it is the proof of everything. It proves He is who He said He is. It proves the price was paid. It proves death has been defeated. He ascended to the right hand of the Father, and He is coming again. That's not just our doctrine — it's the heartbeat of everything we do. We exist to get that message to as many people as possible.",
  },
  {
    title: "The Cross",
    body:
      "We don't just preach about Jesus — we preach the cross. Dying to self is not optional in the Christian life — it's the doorway into it. Following Jesus means picking up your cross daily. It means surrendering your agenda, your pride, and your comfort to follow Him. This is discipleship. This is the life we call people to.",
  },
  {
    title: "Salvation by Grace Through Faith",
    body:
      "We are not saved by our good works, our religious performance, or our moral effort. Salvation is a gift — received by grace through faith in Jesus Christ alone. It is the greatest gift ever given. And it changes everything about how we live.",
  },
  {
    title: "Repentance and New Life",
    body:
      "Coming to Christ means turning away from sin and turning toward God. We believe in genuine repentance — more than just feeling sorry, it's a real change of direction. When a person surrenders their life to Jesus, they become a new creation. The old is gone. The new has come.",
  },
  {
    title: "The Holy Spirit",
    body:
      "We believe in the person and ongoing work of the Holy Spirit in the life of every believer. He convicts, comforts, guides, and transforms. The Holy Spirit indwells every believer at salvation — but we also believe He comes upon believers to clothe them with power for life, witness, and ministry. Jesus Himself promised, “You will receive power when the Holy Spirit comes upon you.” This is a distinct, transformative experience. We believe in praying in the language of the Spirit — a gift from God that builds our faith, strengthens our prayer life, and connects us to Him beyond the limits of our own understanding. We don't just want to talk about the Holy Spirit — we want to encounter Him. Every week.",
  },
  {
    title: "Sanctification",
    body:
      "Salvation is a moment. Discipleship is a lifetime. We believe God is in the business of transforming people from the inside out — not just changing behaviour but renewing minds, healing hearts, and reshaping character. Sanctification is the ongoing work of grace in a life that's surrendered to Him.",
  },
  {
    title: "Water Baptism",
    body:
      "We practise water baptism as a public declaration of faith — an outward expression of an inward transformation. It is an act of obedience, worship, and declaration that says: I belong to Jesus.",
  },
  {
    title: "Communion",
    body:
      "We celebrate Communion regularly as a remembrance of Christ's body broken and blood shed for us. It is a sacred moment where we pause, reflect, and give thanks for the price that was paid so we could be free.",
  },
  {
    title: "Prayer and Fasting",
    body:
      "Prayer is not a religious formality — it's the lifeline of the believer and the engine of the church. Fasting sharpens our dependence on God above all else. Prayer and fasting are not optional extras at Futures. They are the driving force behind everything we do.",
  },
  {
    title: "Miracles",
    body:
      "We believe in the miraculous power of God — healing, restoration, and breakthrough in the lives of everyday people. Through the finished work of Jesus on the cross, healing is available to every believer — spirit, soul, and body. We pray for the sick because Jesus did, and we trust God for the supernatural because what God did then, He still does now. He is the same yesterday, today, and forever.",
  },
  {
    title: "Spiritual Gifts",
    body:
      "The church is not a lecture hall and the congregation is not an audience. We are a body. Every person who walks through our doors carries gifts, callings, and God-given potential that the body needs. We exist to help people discover who they are in Christ and step into their purpose — not just take a seat.",
  },
  {
    title: "Eternity",
    body:
      "We believe in the bodily resurrection of the dead and eternal life for those who are in Christ. We also believe that those who reject Him face eternal separation from God. This is why we preach with urgency. This is why we plant churches. This is why we refuse to stay comfortable.",
  },
  {
    title: "The Return of Christ",
    body:
      "We believe Jesus is coming back. Not as a metaphor. Not as a theological concept to debate. Literally, personally, and soon. His return is imminent, and no one knows the day or the hour. But we don't sit and wait — we occupy. Jesus said, “Do business until I come.” So while we hold the return of Christ with urgency in one hand, we hold the Great Commission with equal urgency in the other. The same Jesus who said “I'm coming soon” also said “Go into all the world.” We take both seriously.",
  },
  {
    title: "The Local Church and the Great Commission",
    body:
      "The local church is God's plan for every community on earth. Not a building. Not a brand. A family. We are committed to being that — generational, multicultural, real, and cause-driven — for every person who calls Futures home. And we are committed to going beyond our walls. Jesus didn't suggest we go into all the world — He commanded it. We are blessed to be a blessing. Helped to help. Healed to heal. Loved to love. Global mission is not a department at Futures Church. It's in our DNA.",
  },
];

export default function WhatWeBelievePage() {
  return (
    <main className="bg-cream-200 text-ink-900">
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at 25% 18%, #F7F1E6 0%, #F2E6D1 42%, #E8C9A6 78%, #D9B089 100%)",
          }}
        />
        <div className="mx-auto max-w-shell px-6 py-32 sm:px-10 sm:py-40 lg:px-16">
          <p className="font-ui text-eyebrow uppercase tracking-[0.28em] text-ink-500">
            Foundations
          </p>
          <h1 className="mt-5 max-w-[18ch] font-display text-display-2xl leading-[0.92] text-ink-900">
            What we <em className="italic">believe</em>.
          </h1>
          <p className="mt-8 max-w-prose font-display text-body-lg italic text-ink-700">
            At Futures Church, we are committed to building our lives, our families, and our church
            on the foundation of God&rsquo;s Word. These are the convictions that drive everything
            we do.
          </p>
        </div>
      </section>

      <section className="border-y border-ink-900/10 bg-cream/60">
        <div className="mx-auto max-w-shell px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
          <ol className="grid gap-y-10 gap-x-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { eyebrow: "Foundation", body: "The Bible is our foundation." },
              { eyebrow: "Focus", body: "Jesus is our focus." },
              { eyebrow: "Power", body: "The Holy Spirit is our power." },
              { eyebrow: "Family", body: "The local church is our family." },
            ].map((p) => (
              <li key={p.eyebrow}>
                <p className="font-ui text-eyebrow uppercase tracking-[0.28em] text-accent">
                  {p.eyebrow}
                </p>
                <p className="mt-3 font-display text-display-md leading-tight text-ink-900">
                  {p.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-32 pt-24 sm:px-10 sm:pt-28 lg:px-16">
        <p className="mb-16 font-ui text-eyebrow uppercase tracking-[0.28em] text-ink-500">
          The seventeen
        </p>
        <ol className="space-y-14 sm:space-y-16">
          {ARTICLES.map((article, idx) => (
            <li key={article.title} className="group relative pl-12 sm:pl-16">
              <span
                aria-hidden
                className="absolute left-0 top-1 font-display text-display-md text-accent"
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display text-display-md leading-tight text-ink-900">
                {article.title}
              </h2>
              <p className="mt-4 whitespace-pre-line font-sans text-body leading-[1.7] text-ink-700">
                {article.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-24 rounded-3xl border border-ink-900/10 bg-cream/80 px-8 py-12 text-center sm:px-12 sm:py-16">
          <p className="font-display text-display-md italic text-ink-900">
            A home for everyone.
          </p>
          <p className="mt-4 max-w-prose mx-auto font-sans text-body text-ink-600">
            Every race. Every age. Every stage. If any of this stirs something in you — or if you
            have questions, doubts, or a story you&rsquo;d like to tell — start a conversation.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/plan-a-visit"
              className="rounded-full bg-ink-900 px-6 py-3 font-ui text-[11px] uppercase tracking-[0.24em] text-cream transition hover:bg-warm-700"
            >
              Plan a visit
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-ink-900/15 bg-cream/70 px-6 py-3 font-ui text-[11px] uppercase tracking-[0.24em] text-ink-900 hover:bg-cream-300"
            >
              Talk to a pastor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
