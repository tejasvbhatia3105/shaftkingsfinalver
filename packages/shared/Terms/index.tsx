import { cn } from '@/utils/cn';

const TermsPage = () => {
  const commonClasses = {
    title: 'text-white',
    subtitle: 'text-white text-sm lg:text-base',
  };

  return (
    <div className="mx-auto flex w-full flex-col px-4 pb-96 pt-16 text-justify lg:max-w-[1330px] lg:px-20 lg:pb-32">
      <h3 className="mb-3 text-lg font-bold dark:text-white lg:text-3xl">
        Terms of Services
      </h3>
      <p className={commonClasses.subtitle}>Last Updated: March 17th, 2025</p>

      <p className={cn('my-5', commonClasses.subtitle)}>
        Please read the Terms and Conditions carefully in their entirety before
        using the Services. The information in this document provides important
        details about your legal obligations when accessing and using Cricket’s
        Services. By proceeding, you acknowledge and agree to comply with the
        Terms outlined herein.
      </p>

      <ol className="dark:text-white lg:ml-4 lg:list-decimal">
        {data.map((item, index) => {
          if (item.isExtension) {
            return (
              <div key={index}>
                {item.paragraph.map((text, idx) => (
                  <p
                    key={idx}
                    className={commonClasses.subtitle}
                    style={{ marginBottom: '1em' }}
                  >
                    {text}
                  </p>
                ))}
                {item.subSections && (
                  <ol className="lg:list-upper-alpha ml-6 dark:text-white">
                    {item?.subSections?.map((subItem, subIndex) => (
                      <li key={subIndex} className="mb-4 text-white">
                        <span className="dark:text-white">
                          {String.fromCharCode(65 + subIndex)}.{' '}
                        </span>
                        <div className="ml-2 inline text-justify">
                          {subItem}
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            );
          }

          return (
            <li key={index} className="mb-5">
              <h4 className="my-2 text-sm font-semibold uppercase dark:text-white lg:text-base">
                {item.title}
              </h4>
              {item.paragraph.map((text, idx) => (
                <p
                  key={idx}
                  className={commonClasses.subtitle}
                  style={{ marginBottom: '1em' }}
                >
                  {text}
                </p>
              ))}
              {item.subSections && (
                <ol className="lg:list-upper-alpha ml-6 dark:text-white">
                  {item.subSections.map((subItem, subIndex) => (
                    <li key={subIndex} className="mb-4 text-[#7F849E]">
                      <span className="dark:text-white">
                        {String.fromCharCode(65 + subIndex)}.{' '}
                      </span>
                      <div className="ml-2 inline text-justify">{subItem}</div>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default TermsPage;

const data = [
  {
    title: 'Acceptance of Terms',
    paragraph: [
      '1.1. By accessing or using Cricket\'s Prediction Markets ("Platform"), you expressly acknowledge and agree to fully comply with the Terms of Service outlined in this document. If you do not agree with any part of these Terms, it is your responsibility to immediately cease using the Platform and discontinue any interaction with our services. Continued use of the Platform, after any disagreement, will constitute your acceptance and agreement to all the Terms set forth herein.',
      "1.2. Cricket reserves the right to modify, amend, or update these Terms of Service at any time, in order to improve or adjust the operation of the Platform, as well as to comply with any legal or regulatory changes. Such modifications will be duly published on the Platform and will be effective from the date of publication. Continued use of the Platform after the publication of modifications to the Terms will be interpreted as the user's unconditional acceptance of the new terms. Therefore, it is the user's responsibility to regularly review the Terms to stay informed about any potential changes..",
    ],
  },
  {
    title: 'Eligibility ',
    paragraph: [
      '2.1. You represent, warrant, and assume full responsibility for: being at least 18 years of age or having reached the minimum legal age required in your jurisdiction to enter into binding contracts and engage in financial transactions, including making predictions and conducting operations on the Platform. Furthermore, you agree to comply with all applicable local laws, regulations, and policies in your region. This includes the responsibility to ensure that you are authorized to participate in the Platform’s services and conduct transactions in accordance with the applicable local legislation',
      '2.2. You acknowledge that the use of the Platform is strictly prohibited in any jurisdiction where prediction activities or cryptocurrency transactions are considered illegal or prohibited by law. In any case, it is your responsibility to verify whether the use of the Platform is allowed in your region and ensure that you comply with local laws, including accepting and adhering to the legal provisions relevant to your conduct and the activities performed through the Platform.',
      '2.3. Cricket is not responsible for users who, whether deliberately or inadvertently, violate local laws. Any violation of these regulations will be the sole responsibility of the user, who may be subject to penalties or legal consequences as determined by the competent authorities in their jurisdiction. Cricket reserves the right to suspend or terminate access to the Platform if it identifies that the user is operating in a region where their activities are illegal.',
    ],
  },
  {
    title: 'Nature of the Service',
    paragraph: [
      '3.1. Cricket offers a decentralized platform where users can participate in prediction markets for cricket matches, making forecasts on the outcomes of future games, based on a variety of information sources, including public data, sentiment analysis, and other relevant factors. The primary goal of Cricket’s prediction markets is to provide an engaging and educational experience, allowing users to enhance their analytical and decision-making skills in sports predictions.',
      '3.2. The service provided by Cricket is intended for entertainment and educational purposes only, and is not suitable or intended to be used as financial or investment advice. While predictions in the market may be based on widely accessible data and verifiable sources, the nature of these markets involves uncertainty and risk. Cricket does not guarantee the accuracy of outcomes or the certainty of success in predictions made, and users should be aware that the market may be influenced by unforeseen variables or sudden changes in the scenario.',
      '3.3. Cricket does not provide, under any circumstances, financial, legal, accounting, or investment advice, whether directly or indirectly, explicitly or implicitly. The Platform is designed to allow users to actively participate in prediction markets, but all decisions related to bets and transactions made on the Platform are the sole and exclusive responsibility of the users.',
      "3.4. Users are fully responsible for their own assessment of the risks involved in each transaction and should seek independent advice from qualified professionals, if necessary, before making any decisions. Cricket will not be liable for any losses or damages that may arise from decisions made based on the information or prediction markets available on the Platform. Participation in Cricket's markets should be considered a risky activity, and users must be prepared to accept the financial consequences of their choices.",
    ],
  },
  {
    title: 'Use of USDC',
    paragraph: [
      '4.1. The official currency used for all transactions within the Cricket Platform is USDC, a widely recognized stablecoin pegged to the US dollar. USDC is the primary means of payment for all interactions within the Platform, including, but not limited to, predictions, NFT purchases, and other financial transactions related to Cricket’s markets and contracts.',
      '4.2. Deposits on the Platform can only be made in USDC. The Platform does not accept deposits in SOL or any other cryptocurrency. Users must ensure they have USDC available in their wallets before making any transactions',
      '4.3. USDC is a stablecoin designed to maintain a 1:1 peg with the US dollar, making it a reliable and predictable medium of exchange within the Platform. However, Cricket does not control the issuance, regulation, or underlying reserves of USDC and is not responsible for any risks associated with third-party stablecoin providers.',
    ],
  },
  {
    title: 'Market Resolution',
    paragraph: [
      '5.1. Prediction markets on the Cricket Platform will be resolved based on official and widely recognized sources, such as match results from verified sports organizations, official cricket governing bodies, or other publicly accessible evidence. Cricket is committed to providing the highest possible accuracy when resolving markets.',
      '5.2. If, for any reason, a prediction market cannot be resolved due to a lack of reliable information, unforeseen events, or extraordinary circumstances, Cricket reserves the right to close the market on the previously established final date, with the refund of the funds wagered to users.',
      '5.3. Payments related to closed markets must be requested within 30 days of the market closure. If payments are not requested within this timeframe, the funds will be automatically returned to the Cricket protocol, closing the matter permanently.',
    ],
  },
  {
    title: 'Event Cancellation and Refund Process',
    paragraph: [
      '5.4. In the case of an event cancellation, Cricket Platform ensures a fair and transparent refund process for all participants. When an event is canceled, the total liquidity available in the market is redistributed proportionally to users based on their initial investments.',
      '5.5. Since some participants may have already sold shares at a profit before the cancellation, the reimbursement calculation takes this into account. The liquidity pool is adjusted accordingly to ensure that no user receives more than they originally invested. This prevents any imbalance in the system and maintains the integrity of the platform.',
      '5.6. By automatically redistributing funds via smart contracts, Cricket Platform guarantees that all users receive their rightful share of the remaining liquidity, providing a seamless and equitable resolution in the event of an unexpected cancellation.',
    ],
  },
  {
    title: 'Fees and Costs',
    paragraph: [
      '6.1. The Platform will charge fixed fees on transactions made. These fees are subject to change at any time, as needed.',
      '6.2. All fees charged are irreversible once the transaction is executed and will not be refunded.',
      '6.3. House earns a minimum of 40% and maximum of 100% of 5% of platform fee.',
    ],
  },
  {
    title: 'Prohibitions and Conduct',
    paragraph: [
      '7.1. It is strictly prohibited within the Cricket Platform to engage in any action that compromises the integrity and transparency of the markets and services provided, including market manipulation, fraud, misinformation, and unauthorized automation.',
    ],
  },
  {
    title: 'Security and Accounts',
    paragraph: [
      '8.1. You are solely responsible for maintaining the security of your access credentials to the Platform.',
      '8.2. Cricket does not control or manage the Solana blockchain or the associated smart contracts.',
      '8.3. If you notice any suspicious activity on your account, including unauthorized transactions, you must immediately notify Cricket’s support team.',
      '8.4. Cricket is committed to updating its systems to mitigate emerging threats and continuously strengthen its security measures.',
    ],
  },
  {
    title: ' Limitation of Liability',
    paragraph: [
      '9.1. Cricket does not guarantee that the Platform will always be available or free from errors. In the event of failures, interruptions, or technical errors, Cricket will do its best to resolve the situation but cannot be held responsible for any losses resulting from such occurrences.',
      '9.2. Cricket is not responsible for any financial loss, technical failures, or unavailability of the Solana blockchain or any other third-party technological infrastructure that may affect the Platform.',
      '9.3. Although Cricket strives to provide accurate and up-to-date information on its platform and during the use of its services, it is important to note that the available data may not always be entirely correct, comprehensive, or current. Changes may occur without prior notice, including adjustments to policies or features, aimed at continuously improving the user experience.',
      '9.4. You are responsible for verifying the accuracy of the information before using it as a basis for any decision. Cricket does not guarantee the accuracy, completeness, or suitability of any data, including price information displayed on our platform. These values may differ from those found on other similar platforms, potentially being higher or lower.',
      "9.5. The use of Cricket's services, especially for interacting with Digital Assets and performing related transactions, involves significant financial risks. Digital Assets are highly volatile, experimental, and subject to rapid changes in value. All transactions conducted through Cricket are irreversible, final, and non-refundable. By accessing and using our platform, you acknowledge these risks and assume full responsibility for using the services.",
      '9.6. You fully accept the consequences of using the services, including the possibility of permanent loss of access to your Digital Assets. All decisions related to transactions made on Cricket are your sole responsibility, and Cricket assumes no obligation or liability arising from your use of the platform. Under no circumstances will we be liable for any losses or damages resulting from your decisions or interactions with the services.',
    ],
  },
  {
    title: 'Intellectual Property',
    paragraph: [
      '10.1. All rights related to trademarks, logos, content, designs, source codes, user interfaces, documentation, and any other materials protected by intellectual property, associated with Cricket, are exclusively owned by Cricket or its licensors. These rights are protected and represent essential assets of the company.',
      '10.2. It is strictly prohibited to copy, reproduce, distribute, modify, create derivative works, publicly display, reverse engineer, or otherwise use, in whole or in part, any intellectual property of Cricket without prior written authorization from the company.',
      '10.3. Unauthorized or improper use of any intellectual property of Cricket will be taken very seriously. Violations of these provisions may result in legal actions, claims for damages, access restrictions to the platform, and any other measures deemed necessary to protect its rights.',
      '10.4. If misuse of any Cricket intellectual property by third parties is identified, users or anyone aware of such a violation are encouraged to report the situation immediately.',
      "10.5. No clause of these Terms grants the user any license or permission to use Cricket's intellectual property, except to the strictly necessary extent to access and use the Services as outlined in these Terms",
    ],
  },
  {
    title: 'Changes to the Terms',
    paragraph: [
      '11.1. Cricket reserves the right to review, modify, update, or supplement these Terms at any time, as deemed necessary to meet operational needs, legal requirements, market changes, or improvements to the user experience.',
      '11.2. In the case of substantial changes, Cricket will take reasonable steps to ensure that all users are informed, including notifications within the Platform or through official communication channels.',
      '11.3. Users are responsible for periodically reviewing the Terms to stay informed about updates.',
      '11.4. If a user does not agree with the updated Terms, they must immediately stop using the Services and, if applicable, close their account on the Platform.',
    ],
  },
  {
    title: 'Disputes and Arbitration',
    paragraph: [
      '12.1. Any controversy, conflict, or dispute arising from or related to these Terms will be resolved exclusively through binding arbitration.',
      '12.2. The parties agree that disputes will be handled individually, expressly waiving any right to participate in class actions or group arbitrations.',
      '12.3. Arbitration will be conducted confidentially, and each party will be responsible for its own legal fees unless otherwise determined.',
      '12.4. If arbitration is not legally applicable, disputes will be submitted to the competent courts while maintaining confidentiality.',
      '12.5. This arbitration agreement does not limit the right of Cricket or the user to seek provisional or preventative measures in any competent court',
    ],
  },
  {
    title: 'General Provisions',
    paragraph: [
      '13.1. These Terms are based on internationally accepted standards for decentralized platforms, ensuring compliance with the best interests of users.',
      '13.2. If any clause of these Terms is declared invalid, the remaining provisions will continue to be fully enforceable.',
      '13.3. Cricket commits to reviewing and adjusting the Terms periodically to ensure compliance with technological advancements and regulatory changes.',
      '13.4. No omission or delay in enforcement of these Terms will be interpreted as a waiver of rights',
    ],
  },
  {
    title: 'Jurisdiction and Service Availability',
    paragraph: [
      '14.1. Cricket operates as a decentralized platform based on the Solana blockchain, without a physical headquarters or operation in any specific jurisdiction',
      '14.2. Access to the Platform is offered exclusively as a decentralized service, without targeting specific countries or territories.',
      '14.3. Users are responsible for complying with local laws when using Cricket.',
      '14.4. Cricket reserves the right to restrict or suspend access if significant violations of applicable laws are detected.',
      '14.5. Cricket does not offer, promote, or facilitate access in any specific jurisdiction. Users access the platform voluntarily and assume full responsibility for compliance with local laws.',
    ],
  },
  {
    title: 'Nature of Decentralized Transactions',
    paragraph: [
      '15.1. All transactions on the Platform are executed through smart contracts deployed on the Solana blockchain, operating autonomously and transparently.',
      '15.2. Cricket does not control transaction methods or smart contracts. Errors, failures, or incorrect executions are the responsibility of the blockchain protocol or its underlying code.',
      '15.3. Users acknowledge that all transactions are irreversible once confirmed by the network.',
      '15.4. Cricket is not responsible for any delays, failures, or interruptions due to the decentralized nature of the Solana blockchain',
      '15.5. Users must understand the risks of interacting with smart contracts, including security vulnerabilities, transaction costs (gas fees), and digital asset price fluctuations.',
    ],
  },
  {
    title: 'Indemnification and Disclaimer of Liability',
    paragraph: [
      '16.1. You agree to defend, indemnify, and hold harmless Cricket, its affiliates, team members, and representatives from any claims, legal actions, losses, or damages arising from:',
    ],
    subSections: [
      'A. Your use of the Cricket platform and transactions conducted through it',
      'B. Digital assets associated with your wallet.',
      'C. Feedback or content provided by you that causes damage or conflicts.',
      "D. Violations of Cricket's terms, rules, or policies.",
      'E. Violations of laws, regulations, or third-party rights',
    ],
    isExtension: true,
  },
  {
    title: '',
    paragraph: [
      '16.2. If indemnification is required, Cricket will have the exclusive right to manage the legal defense.',
      '16.3. You acknowledge that any financial loss resulting from your use of the platform is solely your responsibility.',
    ],
  },

  {
    title: 'Contact ',
    paragraph: [
      '17.1. For questions, complaints, or requests, users can contact Cricket through the official email: hello@cricket.cricket. Our team is committed to providing effective support.',
    ],
  },
];
