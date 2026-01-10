import GujaratTitans, {
  ChennaiSuperKings,
  DelhiCapitals,
  KolkataKnightRiders,
  LucknowSuperGiants,
  MumbaiIndians,
  PunjabKings,
  RajasthanRoyals,
  RoyalChallengersBangalore,
  SunrisersHyderabad,
} from '@/components/Icons/teams';

export function getTeamImage(name: string) {
  const currentName = name.toLocaleLowerCase();
  if (currentName.includes('kolkata knight riders')) {
    return <KolkataKnightRiders />;
  }

  if (currentName.includes('rajasthan royals')) {
    return <RajasthanRoyals />;
  }

  if (currentName.includes('delhi capitals')) {
    return <DelhiCapitals />;
  }

  if (currentName.includes('mumbai indians')) {
    return <MumbaiIndians />;
  }

  if (currentName.includes('chennai super kings')) {
    return <ChennaiSuperKings />;
  }

  if (currentName.includes('Royal Challengers Bengaluru')) {
    return <RoyalChallengersBangalore />;
  }

  if (currentName.includes('gujarat titans')) {
    return <GujaratTitans />;
  }

  if (currentName.includes('lucknow super giants')) {
    return <LucknowSuperGiants />;
  }

  if (currentName.includes('punjab kings')) {
    return <PunjabKings />;
  }

  if (currentName.includes('sunrisers hyderabad')) {
    return <SunrisersHyderabad />;
  }

  return <></>;
}
