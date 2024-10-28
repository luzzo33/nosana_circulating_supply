import { differenceInMonths } from 'date-fns';

const calculateCirculatingSupply = () => {
  const TOTAL_NOS = 100000000; // 100 million tokens
  const distributions = {
    publicSale: 0.03, // 3%
    airdrop: 0.05,    // 5%
    liquidity: 0.10,  // 10%
    backers: 0.17,    // 17% (10% immediate, 90% linear over 9 months)
    mining: 0.20,     // 20% linear over 24 months
    team: 0.20,       // 20% linear over 48 months
    company: 0.25,    // 25% (10% immediate, 90% linear over 36 months)
  };

  const startDate = new Date('2022-01-17T00:00:00Z');
  const endDate = new Date('2026-01-17T00:00:00Z');
  const now = new Date();

  if (now < startDate) return 0;
  if (now > endDate) return TOTAL_NOS;

  let totalCirculating = 0;

  // Immediate Release Pools
  totalCirculating += TOTAL_NOS * distributions.publicSale;
  totalCirculating += TOTAL_NOS * distributions.airdrop;
  totalCirculating += TOTAL_NOS * distributions.liquidity;

  // Backers
  const backersImmediate = TOTAL_NOS * distributions.backers * 0.10;
  const backersLinear = TOTAL_NOS * distributions.backers * 0.90;
  const backersReleaseDurationMonths = 9;
  const backersElapsedMonths = differenceInMonths(now, startDate);

  if (backersElapsedMonths >= backersReleaseDurationMonths) {
    totalCirculating += backersLinear;
  } else if (backersElapsedMonths > 0) {
    totalCirculating += (backersLinear / backersReleaseDurationMonths) * backersElapsedMonths;
  }
  totalCirculating += backersImmediate;

  // Mining
  const miningReleaseDurationMonths = 24;
  const miningElapsedMonths = differenceInMonths(now, startDate);

  if (miningElapsedMonths >= miningReleaseDurationMonths) {
    totalCirculating += TOTAL_NOS * distributions.mining;
  } else if (miningElapsedMonths > 0) {
    totalCirculating += (TOTAL_NOS * distributions.mining / miningReleaseDurationMonths) * miningElapsedMonths;
  }

  // Team
  const teamReleaseDurationMonths = 48;
  const teamElapsedMonths = differenceInMonths(now, startDate);

  if (teamElapsedMonths >= teamReleaseDurationMonths) {
    totalCirculating += TOTAL_NOS * distributions.team;
  } else if (teamElapsedMonths > 0) {
    totalCirculating += (TOTAL_NOS * distributions.team / teamReleaseDurationMonths) * teamElapsedMonths;
  }

  // Company
  const companyImmediate = TOTAL_NOS * distributions.company * 0.10;
  const companyLinear = TOTAL_NOS * distributions.company * 0.90;
  const companyReleaseDurationMonths = 36;
  const companyElapsedMonths = differenceInMonths(now, startDate);

  if (companyElapsedMonths >= companyReleaseDurationMonths) {
    totalCirculating += companyLinear;
  } else if (companyElapsedMonths > 0) {
    totalCirculating += (companyLinear / companyReleaseDurationMonths) * companyElapsedMonths;
  }
  totalCirculating += companyImmediate;

  totalCirculating = Math.min(Math.floor(totalCirculating), TOTAL_NOS);

  return totalCirculating;
};

export default calculateCirculatingSupply;
