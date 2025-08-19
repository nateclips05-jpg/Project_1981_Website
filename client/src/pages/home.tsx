import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import * as React from "react";
import Logo from "@/components/assets/logo.png";
import hero from "@/components/assets/hero.jpg";

export default function Home() {
  const { isAuthenticated } = useAuth();

  // Replace with your actual image URLs
  const HERO_IMG = hero;
  
  const TILE_1 =
 "https://w0.peakpx.com/wallpaper/161/525/HD-wallpaper-friday-the-13th-game-friday-the-13th-the-games-2019-games-games-mask.jpg";

  const TILE_2 =
  "https://p19-pu-sign-useast8.tiktokcdn-us.com/tos-useast5-avt-0068-tx/34924cb9ee6e2c20c17d8b6b2dd5989a~tplv-tiktokx-cropcenter:1080:1080.jpeg?dr=9640&refresh_token=c6acd92f&x-expires=1755651600&x-signature=5imLZDrXzGF4539c3cD%2B8qpxzYo%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=useast8";

  const TILE_3 =
    "https://media.discordapp.net/attachments/1003364894919364679/1397690331176374302/image.png?ex=68a3998e&is=68a2480e&hm=dbac365279f3a225ac7015bf27d14d0e99d5711f6551ec12db4194842eb10add&=&format=webp&quality=lossless&width=2018&height=986";

  // --- NEWS DATA (swap these with your real posts) ---
  const NEWS: Array<{
    id: string;
    title: string;
    sub: string;
    href: string;
    img: string;
    size: "row1" | "row2";
  }> = [
    {
      id: "n1",
      title: "1981 — The Ultimate Slasher Experience",
      sub: "Pre Orders Available Now!",
      href: "/news/ultimate-slasher-editions",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6wkQtGyKE-k7Rl-YhElUJBxuxy9m4S6lyUl3XJ1gPvPamCjYXVY5Z7XUYOvLSsxdV77o&usqp=CAU",
      size: "row1",
    },
    {
      id: "n2",
      title: "Behind the Scenes",
      sub: "A closer look on how Project 1981 came to be",
      href: "/news/end-of-content",
      img: "https://media.discordapp.net/attachments/1003364894919364679/1396255682163900528/image.png?ex=68a4502f&is=68a2feaf&hm=e53f206bf3c11dc8f087b05b0b06c3d6234e4d8104b765adf0dd4d4f0007edba&=&format=webp&quality=lossless&width=1466&height=771",
      size: "row1",
    },
    {
      id: "n3",
      title: "Skull Objectives",
      sub: "Unlock 30 new emotes",
      href: "/news/skull-objectives",
      img: "https://cdn.discordapp.com/attachments/1003364894919364679/1377395566652297246/image.png?ex=68a39895&is=68a24715&hm=43868bc3a5556009de0747c7cac287a3bb6d7c70b15fd9d115de9bc7ed345e96&",
      size: "row2",
    },
    {
      id: "n4",
      title: "Update Status",
      sub: "First Look: Developer News & Updates",
      href: "/news/update-status",
      img: "https://media.discordapp.net/attachments/1003364894919364679/1402770066767872041/image.png?ex=68a4482e&is=68a2f6ae&hm=8ca63853bd88ad1fc78aa5a152ae78bf3c7b05975f4056f2f4ceaaacf248d1cf&=&format=webp&quality=lossless&width=1475&height=771",
      size: "row2",
    },
    {
      id: "n5",
      title: "XP & NP Event",
      sub: "Survive. Escape. Earn More.",
      href: "/news/xp-cp-tape-event",
      img: "https://cdn.discordapp.com/attachments/1003364894919364679/1398444905935933630/image.png?ex=68a3b54f&is=68a263cf&hm=8e4f8f6b4be0f2862f7a41fa9bd9cedc27120f9d6f52320fb98b11035aec1347&",
      size: "row2",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0a0b] text-white">
      {/* NAV (full-bleed so logo hugs screen-left) */}
      <header className="sticky top-0 z-40 bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="flex h-20 items-center justify-between px-4 sm:px-6">
          
          <Link href="/" aria-label="Project 1981" className="flex items-center">
            <img
              src={Logo}
              alt="Project 1981"
              className="h-16 w-auto object-contain select-none"
              draggable={false}
            />
          </Link>


          <nav className="hidden md:flex items-center gap-6 text-sm text-white/90">
            <Link href="/" className="hover:text-white">News</Link>
            <a href="#games" className="hover:text-white">Patches</a>
            <a href="#community" className="hover:text-white">Community</a>
            <a href="#forums" className="hover:text-white">Forums</a>

            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="bg-red-600 hover:bg-red-700 rounded-full px-4 py-1 font-bold">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/signin">
                <Button className="bg-red-600 hover:bg-red-700 rounded-full px-4 py-1 font-bold">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section
        className="relative"
        aria-label="Hero"
        style={{
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black/65" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_500px_at_80%_-10%,rgba(220,38,38,0.22),transparent_60%)] pointer-events-none" />

        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
          <div className="min-h-[56svh] sm:min-h-[62svh] md:min-h-[68svh] lg:min-h-[72svh] grid items-end pb-8 sm:pb-10 md:pb-12">
            <div className="max-w-[60ch]">
              <h2
                className="font-extrabold leading-[0.95] drop-shadow-[0_10px_30px_rgba(0,0,0,.4)] 
                           text-5xl sm:text-6xl md:text-7xl"
                style={{ fontSize: "clamp(2.5rem, 6.5vw, 6rem)" }}
              >
                Project 1981:
                <br />
               Pre-Alpha
              </h2>

              <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link href="#news" className="group inline-flex items-center">
                  <span className="text-white font-semibold tracking-wide">
                    Read More
                  </span>
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1 text-white">
                    ▸
                  </span>
                </Link>


                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-md px-4 py-2 sm:px-5 sm:py-2.5"
                >
                  <i className="fas fa-play mr-2 text-white" />
                  Watch Trailer
                </Button>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-TILE STRIP — FULL-BLEED with solid white border/dividers */}
      <section className="-mt-5 sm:-mt-6 relative z-10" id="news">
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
          <div className="border border-white bg-black/30 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:flex md:divide-x md:divide-white">
              <StripTile
                img={TILE_1}
                over={<p className="text-xs sm:text-sm text-white font-semibold">GAME ARRIVES IN STORES ON</p>}
                title="SUNDAY OCTOBER 31ST, 2025"
                desc="Available on Roblox — PC, Mobile, and Console"
                className="md:basis-1/3"
              />
              <StripTile
                img={TILE_2}
                over={<p className="text-xs sm:text-sm text-white font-semibold">Content Creator of the Week</p>}
                title="bananaburnt"
                desc="Spotlight your creator or partner here."
                className="md:basis-1/3"
              />
              <StripTile
                img={TILE_3}
                over={<p className="text-xs sm:text-sm text-white font-semibold">Update Status</p>}
                title="First Look: Engine Update"
                desc="We’ve pushed the Roblox engine to its limits — dynamic lighting, fog, and atmosphere that deliver striking horror visuals across PC, Mobile, and Console."
                className="md:basis-1/3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* NEWS SECTION (under the 3 boxes) */}
      <section className="py-8 sm:py-10 md:py-12">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white/90">News</h2>
          <div className="mt-2 h-px bg-white/15" />

          {/* Row 1 — two large posts */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {NEWS.filter(n => n.size === "row1").map((n) => (
              <NewsTile key={n.id} {...n} />
            ))}
          </div>

          {/* Row 2 — three medium posts */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {NEWS.filter(n => n.size === "row2").map((n) => (
              <NewsTile key={n.id} {...n} />
            ))}
          </div>

          {/* View all */}
          <div className="mt-4 flex justify-end">
            <Link href="/all-news" className="group inline-flex items-center text-white/90 hover:text-white">
              <span className="font-semibold">View all news</span>
              <span className="ml-2 transition-transform group-hover:translate-x-1">▸</span>
            </Link>
          </div>
        </div>
      </section>

      {/* --- Fan Disclaimer (place below the News section) --- */}
      <section aria-label="Fan disclaimer" className="py-10 px-4 sm:px-6">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="border border-white/20 bg-white/[0.03] p-6 sm:p-8">
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Unofficial, Non-Profit Fan Remake
            </h3>
            <p className="text-white/85 leading-relaxed">
              This project is a non-commercial, fan-made remake inspired by
              <span className="font-semibold"> Friday the 13th: The Game</span>.
              It is created and maintained by a single individual and is not
              affiliated with, endorsed by, or sponsored by any rights holders.
            </p>
            <p className="text-white/70 text-sm leading-relaxed mt-4">
              “FRIDAY THE 13TH” and all related characters and elements are trademarks of
              and © New Line Productions, Inc. and Horror, Inc. (each to the extent of their
              interest). All other trademarks and copyrights are the property of their
              respective owners. This remake is for fan/educational purposes only.
            </p>
          </div>
        </div>
      </section>


      {/* STATS */}
      <section className="py-14 sm:py-16 md:py-20 px-4 sm:px-6 bg-white/[0.03]">
        <div className="mx-auto w-full max-w-[1200px]">
          <h3 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">
            Platform Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              ["_", "Active Players"],
              ["_", "Game Modes"],
              ["_", "Matches Played"],
              ["24/7", "Server Uptime"],
            ].map(([big, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-red-500 mb-1">
                  {big}
                </div>
                <div className="text-white/70 text-sm sm:text-base">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black/60 border-t border-white/10 py-10 sm:py-12 px-4 sm:px-6">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Link href="/" className="inline-flex items-center" aria-label="Project 1981">
                  <img
                    src={Logo}
                    alt="Project 1981"
                    className="h-15 md:h-12 w-auto object-contain select-none"
                    draggable={false}
                  />
                </Link>
                <h4 className="text-lg font-bold">Project 1981</h4>
              </div>

              <p className="text-white/70">
                Stay Tuned for more updates on our progress and new features!
              </p>
            </div>

            <FooterCol 
              title="Games" 
              items={[
                { label: "Regular" },        // just text, no link
                { label: "Hardcore" },       // another text item
                { label: "Coming Soon" }     // another text item
              ]}
            />

            <FooterCol 
              title="Community" 
              items={[
                { label: "Discord", link: "https://discord.com/invite/GVCDFaM3EZ" },
                { label: "YouTube", link: "https://www.youtube.com/@yerboinate" },
                { label: "TikTok", link: "https://www.tiktok.com/@natethegreat_yt" }
              ]}
            />

              <FooterCol 
                title="Support" 
                items={[
                  { label: "Help Center" },
                  { label: "Contact" },
                  { label: "Bug Reports" }
                ]}
              />

          </div>

          <div className="border-t border-white/10 mt-8 pt-6 text-center text-white/60">
            <p>&copy; {new Date().getFullYear()} Project 1981. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- helpers ---------- */

function StripTile({
  img,
  over,
  title,
  desc,
  className = "",
}: {
  img: string;
  over: React.ReactNode;
  title: string;
  desc: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative aspect-[21/9] sm:aspect-[24/9]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${img})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/65 via-black/45 to-transparent" />
        <div className="absolute inset-0 p-4 sm:p-5 md:p-6 flex flex-col justify-end">
          {over}
          <h4 className="mt-1 text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-wide">
            {title}
          </h4>
          <p className="mt-1 text-white/85 text-xs sm:text-sm font-medium">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function NewsTile({
  title,
  sub,
  href,
  img,
  size,
}: {
  title: string;
  sub: string;
  href: string;
  img: string;
  size: "row1" | "row2";
}) {
  const aspect = size === "row1" ? "aspect-[16/9]" : "aspect-[16/9]";
  const [open, setOpen] = React.useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    setOpen(true);
  }

  return (
    <>
      <a
        href="#"
        onClick={handleClick}
        className={`relative block overflow-hidden border border-white/15 bg-black/40 ${aspect} 
                    group transition duration-300`}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${img})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute inset-0 p-4 sm:p-5 md:p-6 flex items-end">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold">
              {title}
            </h3>
            <span className="text-white/85">{sub}</span>
          </div>
        </div>
      </a>

      {/* Inline "Coming Soon" popup */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* card */}
          <div className="relative z-10 w-[90vw] max-w-md rounded-md border border-white/15 bg-[#0b0a0b] shadow-2xl">
            <div className="relative aspect-[16/9]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${img})` }}
              />
              <div className="absolute inset-0 bg-red-600/30 mix-blend-multiply" />
            </div>
            <div className="p-5">
              <h3 className="text-2xl font-extrabold mb-1">Coming Soon</h3>
              <p className="text-white/85">{title}</p>
              <p className="text-white/60 text-sm">{sub}</p>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-bold hover:bg-red-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}





function Feature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <Card className="bg-white/[0.04] border-white/10 rounded-md hover:border-white/20 transition">
      <CardContent className="p-6 sm:p-8">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-md bg-red-600/20 grid place-items-center mb-4 sm:mb-5">
          <i className={`fas ${icon} text-red-500 text-lg sm:text-xl`} />
        </div>
        <h4 className="text-xl sm:text-2xl font-bold mb-2">{title}</h4>
        <p className="text-white/70 text-sm sm:text-base">{text}</p>
      </CardContent>
    </Card>
  );
}

function FooterCol({ 
  title, 
  items 
}: { 
  title: string; 
  items: { label: string; link?: string }[] // link is optional
}) {
  return (
    <div>
      <h5 className="font-semibold mb-3">{title}</h5>
      <ul className="space-y-2 text-white/70">
        {items.map((i) => (
          <li key={i.label}>
            {i.link ? (
              <a 
                href={i.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors"
              >
                {i.label}
              </a>
            ) : (
              <span>{i.label}</span> // plain text if no link
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
