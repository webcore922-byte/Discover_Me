import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { HiTrophy, HiMapPin, HiCalendarDays } from "react-icons/hi2";
import { GiSoccerBall, GiStarMedal } from "react-icons/gi";

const PrizesAndCompetitions = () => {
  const [competitions, setCompetitions] = useState([]);
  const [league, setLeague] = useState(null);
  const [monthlyWinners, setMonthlyWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    const baseUrl = import.meta.env.VITE_URL;

    try {
      setLoading(true);
      setError(false);
      const [compRes, leagueRes, winnersRes] = await Promise.all([
        fetch(`${baseUrl}/active_competitions`),
        fetch(`${baseUrl}/creative_league`),
        fetch(`${baseUrl}/monthly_winners`),
      ]);

      if (compRes.ok && leagueRes.ok && winnersRes.ok) {
        const compData = await compRes.json();
        const leagueData = await leagueRes.json();
        const winnersData = await winnersRes.json();

        setCompetitions(compData);
        setLeague(leagueData);
        setMonthlyWinners(winnersData);
      } else {
        setError(true);
        console.log("server is down");
      }

      setLoading(false);
    } catch (err) {
      setError(true);
      console.log("server is down");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return <div className="text-center py-20 text-white">جاري التحميل...</div>;

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1d1e] text-center px-4">
        <span className="text-8xl mb-6">⚠️</span>
        <Typography variant="h4" className="text-white font-bold mb-2">
          نواجه مشكلة في تحميل البيانات
        </Typography>
        <Typography className="text-[#b0b0b0]">حاول مرة أخرى لاحقاً</Typography>
        <Button
          onClick={fetchData}
          className="mt-6 bg-[#d4af37] text-[#1a1d1e]"
        >
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <section
      className="relative min-h-screen py-16 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('bg_prizes_and_competitions.jpeg')` }}
    >
      <div className="absolute inset-0 bg-[#1a1d1e]/90 -z-10"></div>

      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <GiStarMedal className="text-4xl text-[#d4af37] icon-pulse" />
          </div>
          <Typography
            variant="h1"
            className="text-gradient-gold text-4xl md:text-5xl font-bold mb-4 pb-5"
          >
            الجوائز والمسابقات
          </Typography>
          <Typography className="text-[#b0b0b0] max-w-2xl mx-auto text-lg leading-relaxed">
            نقدم بشكل دوري مسابقات وتحديات تهدف إلى تحفيز المستخدمين على تقديم
            أفضل ما لديهم، تتيح هذه المسابقات فرصاً للفوز بجوائز مميزة.
          </Typography>
        </div>

        <div className="flex flex-wrap justify-center gap-12 mb-12">
          {competitions.map((item) => (
            <Card
              key={item.id}
              className="glass-card hover-gold-card card-shine border-none overflow-hidden"
            >
              <CardHeader
                floated={false}
                className="h-48 m-0 rounded-none bg-[#242829]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-60"
                />
              </CardHeader>
              <CardBody className="p-6">
                <Typography
                  variant="h5"
                  className="text-[#d4af37] font-bold mb-2"
                >
                  {item.title} - {item.location}
                </Typography>
                <Typography className="text-white text-sm mb-4">
                  <span className="text-[#d4af37] font-bold">الهدف: </span>{" "}
                  {item.goal}
                </Typography>
                <div className="flex items-center gap-2 text-[#b0b0b0] text-xs mb-5">
                  <HiCalendarDays className="text-[#d4af37]" />{" "}
                  {item.date_range}
                </div>
                <div className="bg-[#1a1d1e]/60 p-3 rounded border border-[#a68946]/20 mb-5">
                  <Typography className="text-[#d4af37] text-sm font-semibold italic">
                    1st: {item.prizes.first || item.prizes.grand_prize}
                  </Typography>
                  {item.prizes.second && (
                    <Typography className="text-[#d4af37] text-sm font-semibold italic mt-1">
                      2nd: {item.prizes.second}
                    </Typography>
                  )}
                </div>
                <Button
                  fullWidth
                  className="bg-gradient-to-r from-[#c5a059] to-[#8e7037] text-[#1a1d1e] font-bold py-3 shadow-none"
                >
                  شارك الآن
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="glass-card border-none p-8 h-full relative overflow-hidden justify-center">
              <GiSoccerBall className="text-[150px] text-[#d4af37] opacity-5 absolute -right-10 -bottom-10" />
              <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                <div className="flex flex-col items-center gap-3">
                  <HiTrophy className="text-8xl text-[#d4af37] icon-pulse mb-2" />
                  <div className="text-center">
                    <Typography className="text-xs text-[#b0b0b0] uppercase tracking-tighter">
                      المركز الأول حالياً
                    </Typography>
                    <Typography className="text-white font-bold">
                      {league?.leaderboard?.[0]?.name}
                    </Typography>
                  </div>
                </div>
                <div className="flex-1 ">
                  <Typography
                    variant="h3"
                    className="text-[#d4af37] font-bold mb-3"
                  >
                    {league?.title}
                  </Typography>
                  <Typography className="text-white/80 text-sm mb-6 leading-loose">
                    {league?.description}
                  </Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border-l-2 border-[#d4af37] pl-4">
                      <Typography className="text-xs text-[#b0b0b0]">
                        الجائزة الكبرى
                      </Typography>
                      <Typography className="text-gradient-gold font-bold text-sm">
                        {league?.grand_prize}
                      </Typography>
                    </div>
                    <div className="border-l-2 border-[#d4af37] pl-4">
                      <Typography className="text-xs text-[#b0b0b0]">
                        حالة الدوري
                      </Typography>
                      <Typography className="text-white font-bold text-sm">
                        {league?.status}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="glass-card border-none p-6 h-full">
              <Typography
                variant="h5"
                className="text-[#d4af37] font-bold mb-6 flex items-center gap-2"
              >
                <GiStarMedal /> الجوائز الشهرية
              </Typography>
              <div className="space-y-5">
                {monthlyWinners.map((winner, index) => (
                  <div
                    key={index}
                    className="group border-b border-[#a68946]/10 pb-4 last:border-0"
                  >
                    <Typography className="text-[#b0b0b0] text-[10px] font-bold uppercase mb-1">
                      {winner.category}
                    </Typography>
                    <Typography className="text-white font-bold group-hover:text-[#d4af37] transition-colors">
                      {winner.winner_name}
                    </Typography>
                    <Typography className="text-[#d4af37] text-xs italic mt-1 font-medium italic">
                      {winner.prize}
                    </Typography>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrizesAndCompetitions;
