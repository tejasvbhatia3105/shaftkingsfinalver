'use client';

const DocsPage = () => {
  return (
    <div className="mt-6 size-full min-h-[100vh] flex-1 pb-12">
      <div className="mx-auto w-full max-w-[1200px] pt-12">
        <span className="block text-xl font-bold text-white">
          Introduction to Cricket Platform
        </span>
        <span className="mt-4 block text-[#7F849E]">
          Cricket Platform is a decentralized prediction market built on the
          Solana blockchain, offering users the chance to engage with cricket
          matches and tournaments through predictions. On Cricket Platform, you
          can trade predictions on various cricket games, turning your knowledge
          and insights into actionable strategies.
        </span>
        <span className="mt-4 block text-[#7F849E]">
          By utilizing the robust infrastructure of Solana, Cricket Platform
          ensures that all transactions are fast, secure, and transparent. Each
          market is designed to reflect cricket events globally and regionally,
          providing users with real-time opportunities for speculation. With
          Cricket Platform, every decision is an opportunity to engage deeply,
          earn rewards, and immerse yourself in an innovative, decentralized
          ecosystem.
        </span>
        <img
          src="/assets/img/shaftkings-terms.webp"
          className="mt-5 h-auto w-full"
          alt="cricket logo gold"
        />
        <div className="mt-12 space-y-6 text-[#7F849E]">
          <section>
            <p className="mb-5 text-xl font-bold text-white">
              What Are Prediction Markets?
            </p>
            <p>
              Prediction markets are platforms that allow participants to trade
              shares representing the likelihood of future events. These markets
              harness collective intelligence, enabling speculation on cricket
              matches and tournaments. The price of a share reflects the
              aggregated probability the market assigns to a particular outcome.
              For example, if a share about a cricket match result is priced at
              0.70 USDC, it suggests a 70% chance of that outcome occurring.
              Users can buy or sell shares based on their expectations,
              profiting from accurate predictions.
            </p>

            <p className="mt-5">
              Additionally, prediction markets enable trading based on the
              fluctuation of share prices, allowing participants to speculate on
              price increases or decreases over time, even before the match is
              resolved. This creates a unique market dynamic where both accurate
              predictions and trading strategies can lead to profit
              opportunities.
            </p>
          </section>

          <section>
            <p className="mb-5 text-xl font-bold text-white">
              How Cricket Platform Works
            </p>
            <p>
              Cricket Platform empowers you to act on your predictions by
              choosing between two straightforward options:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                ✅ <strong className="text-white">YES</strong>: Predict that the
                event will happen. If you&apos;re right, you&apos;ll earn
                rewards based on the accuracy of your forecast.
              </li>
              <li>
                ❌ <strong className="text-white">NO</strong>: Predict that the
                event won’t happen. If your prediction holds true, you’ll
                receive rewards proportional to the outcome.
              </li>
            </ul>
          </section>

          <section>
            <p className="mb-5 text-xl font-bold text-white">
              Key Features of Cricket Platform Markets
            </p>
            <p>
              At Cricket Platform, all markets are resolved on a 1:1 basis,
              meaning that when a market closes, the winners receive an amount
              equivalent to what participants who predicted the opposite outcome
              contributed, based on the probability of the event occurring. This
              system ensures fairness and transparency for all users.
            </p>
          </section>

          <section>
            <p className="mb-5 text-xl font-bold text-white">
              How the 1:1 Payment Mechanism Works
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                🔹{' '}
                <strong className="text-white">
                  Predictions in the Market:
                </strong>{' '}
                Users make predictions about specific outcomes (e.g., which team
                will win). Participants who predict different outcomes
                contribute to the market&apos;s &quot;pool.&quot;
              </li>
              <li>
                🔹{' '}
                <strong className="text-white">
                  Market Value and Probability:
                </strong>{' '}
                The value of contributions is determined by the likelihood of a
                specific outcome occurring. The more participants predict one
                outcome, the lower the reward, as the probability of that result
                is considered higher. Conversely, predictions on
                lower-probability outcomes offer higher potential rewards, as
                they are riskier.
              </li>
              <li>
                🔹{' '}
                <strong className="text-white">
                  The Losing Side Pays the Winner:
                </strong>{' '}
                After the match concludes and the result is known, the winners
                receive their share of the total contribution. The process works
                as follows: Participants who predicted the incorrect outcome
                lose their contributions and pay the winners. The amount is
                distributed according to the total contributions and
                probabilities. Winners receive amounts based on their
                predictions and associated probabilities.
              </li>
            </ul>
          </section>

          <section>
            <p className="mb-5 text-xl font-bold text-white">
              Practical Example
            </p>
            <p>In a cricket prediction market:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                🏏 Two options are available: &quot;Team A Wins&quot; and
                &quot;Team B Wins.&quot;
              </li>
              <li>
                💰 1000 USDC is contributed to &quot;Team A Wins&quot; and 2000
                USDC to &quot;Team B Wins.&quot;
              </li>
              <li>
                🏆 If &quot;Team A Wins&quot; is correct, participants who
                predicted &quot;Team B Wins&quot; lose their contributions and
                pay those who predicted &quot;Team A Wins,&quot; proportionally
                to the predicted probabilities.
              </li>
            </ul>
          </section>

          <section>
            <p className="mb-5 text-xl font-bold text-white">
              Transparency Guarantee
            </p>
            <p>
              The entire process is executed through smart contracts, ensuring
              that the payment from one side to the other is carried out
              automatically, quickly, and accurately, with no intermediaries.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
