package com.example.crimeinvestigation.config;

import com.example.crimeinvestigation.entity.Case;
import com.example.crimeinvestigation.entity.Clue;
import com.example.crimeinvestigation.entity.User;
import com.example.crimeinvestigation.repository.CaseRepository;
import com.example.crimeinvestigation.repository.ClueRepository;
import com.example.crimeinvestigation.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner seedData(UserRepository userRepo, CaseRepository caseRepo, ClueRepository clueRepo) {
        return args -> {

            // ── Seed Users ─────────────────────────────────────
            if (userRepo.count() == 0) {
                userRepo.saveAll(List.of(
                    User.builder().name("Inspector Rajesh Kumar").username("admin").email("admin@crimeintel.com").password("admin123").role("ADMIN").build(),
                    User.builder().name("Priya Sharma").username("user").email("user@crimeintel.com").password("user123").role("USER").build()
                ));
            }

            // ── Seed Cases ──────────────────────────────────────
            if (caseRepo.count() == 0) {
                List<Case> cases = List.of(

                    // 1. ATM Robbery
                    Case.builder().title("ATM Robbery at MG Road, Bangalore").status("UNSOLVED")
                        .evidenceUrl("https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=800&q=80")
                        .description("On the night of 14th March, two masked men broke into an SBI ATM kiosk on MG Road, Bangalore at around 11:45 PM. They used an angle grinder to cut open the ATM machine and fled with approximately Rs 8.4 lakh in cash. A CCTV camera at a nearby medical shop captured a partial view of a black Pulsar bike with no number plate. The suspects wore helmets throughout and escaped via the Residency Road flyover. Local auto drivers reported seeing two men in dark jackets near the kiosk around 11 PM.")
                        .createdBy(1L).build(),

                    // 2. Chain Snatching
                    Case.builder().title("Gold Chain Snatching in Andheri West, Mumbai").status("UNSOLVED")
                        .evidenceUrl("https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80")
                        .description("A 58-year-old woman was returning from a temple on Lokhandwala Road, Andheri West when a man on a red Honda Activa snatched her 22-gram gold chain at around 7:30 AM on 2nd April. The victim fell and sustained minor injuries. A shopkeeper nearby noted the scooter had a scratched rear mudguard and a broken left indicator. The suspect was wearing a blue shirt and a black cap. Police recovered a partial fingerprint from the victim's dupatta where the chain was grabbed.")
                        .createdBy(1L).build(),

                    // 3. UPI Fraud
                    Case.builder().title("UPI Fraud Targeting Senior Citizens, Hyderabad").status("UNSOLVED")
                        .evidenceUrl("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80")
                        .description("Over 40 senior citizens in Banjara Hills and Jubilee Hills, Hyderabad were defrauded of a combined Rs 23 lakh through a UPI scam between January and March. Victims received calls from individuals posing as bank KYC officers claiming their accounts would be blocked. They were asked to share OTPs and scan QR codes on PhonePe and Google Pay. The money was transferred to mule accounts across Rajasthan and UP. Cybercrime cell traced the SIM cards to a fake Aadhaar-based registration in Jharkhand.")
                        .createdBy(1L).build(),

                    // 4. Missing Person
                    Case.builder().title("Missing College Student — Whitefield, Bangalore").status("UNSOLVED")
                        .evidenceUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80")
                        .description("Kavya Reddy, a 21-year-old engineering student from RVCE, was last seen leaving her PG accommodation in Whitefield on 5th September at 6:15 PM. Her Ola cab booking shows she cancelled the ride midway near ITPL Main Road. Her mobile phone was switched off at 6:48 PM and has not been active since. CCTV footage from a nearby petrol bunk shows her speaking to an unknown man near a grey Swift Dzire. Her family reports she had been receiving unknown calls for two weeks prior to her disappearance.")
                        .createdBy(1L).build(),

                    // 5. Hit and Run
                    Case.builder().title("Hit and Run on NH-48, Delhi-Gurugram Expressway").status("UNSOLVED")
                        .evidenceUrl("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80")
                        .description("A 35-year-old delivery worker was fatally struck by a speeding vehicle on NH-48 near Rajokri flyover at 2:20 AM on 18th June. The victim was riding a bicycle when a dark-coloured SUV hit him from behind and fled without stopping. Toll plaza cameras 3 km ahead captured a black Toyota Fortuner with a cracked front bumper. The vehicle's number plate was partially obscured with mud. A broken headlight casing recovered at the scene matches a 2019-2022 Fortuner model. No arrests have been made.")
                        .createdBy(1L).build(),

                    // 6. Mobile Theft
                    Case.builder().title("Organised Mobile Theft Gang — Chennai Central").status("UNSOLVED")
                        .evidenceUrl("https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80")
                        .description("A gang of three individuals has been stealing high-end smartphones at Chennai Central Railway Station and T. Nagar bus stand since February. Over 60 iPhones and Samsung Galaxy devices worth Rs 35 lakh have been reported stolen. The gang operates during peak hours, targeting commuters distracted by luggage. IMEI tracking shows the phones being sold through a second-hand shop in Purasawalkam. One suspect was caught on camera wearing a railway porter uniform as disguise. A tip from a local informant identified a warehouse in Ambattur.")
                        .createdBy(1L).build(),

                    // 7. Online Job Scam
                    Case.builder().title("Fake IT Job Scam Targeting Freshers — Pune").status("UNSOLVED")
                        .evidenceUrl("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80")
                        .description("Over 120 engineering graduates in Pune were defrauded of Rs 1.2 crore through a fake IT recruitment scam operating via LinkedIn and Naukri.com between April and July. Victims were promised jobs at top MNCs and asked to pay Rs 8,000 to Rs 25,000 as registration and training fees. The scammers used cloned websites of Infosys and TCS with fake offer letters bearing forged digital signatures. Payments were collected via UPI IDs linked to shell accounts. The operation was traced to a rented office in Viman Nagar that was vacated overnight.")
                        .createdBy(1L).build(),

                    // 8. Fake Loan App
                    Case.builder().title("Predatory Loan App Harassment — Kolkata").status("UNSOLVED")
                        .evidenceUrl("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80")
                        .description("At least 200 residents of Howrah and Salt Lake City, Kolkata filed complaints against a fake instant loan app called 'QuickRupee' that charged 400% annual interest and harassed borrowers by sending morphed obscene images to their contacts. The app accessed phone contacts and gallery upon installation. Victims who borrowed Rs 5,000 were demanded Rs 40,000 within a week. The app was distributed via WhatsApp APK links. Server logs traced to a data centre in Guangzhou, China, with local operators in Kolkata managing recovery calls.")
                        .createdBy(1L).build(),

                    // 9. Drug Trafficking
                    Case.builder().title("Drug Trafficking Network — Goa Coastal Route").status("UNSOLVED")
                        .evidenceUrl("https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&q=80")
                        .description("Narcotics Control Bureau intercepted 12 kg of MDMA and 8 kg of cocaine concealed inside frozen fish consignments at Mormugao Port, Goa on 12th October. The shipment originated from a vessel registered in Sri Lanka. Two local fishermen were arrested as carriers but the kingpin remains at large. Encrypted WhatsApp messages recovered from the arrested individuals point to a handler operating from Bandra, Mumbai. Financial transactions show Rs 1.8 crore transferred to hawala operators in Dubai over three months.")
                        .createdBy(1L).build(),

                    // 10. House Burglary
                    Case.builder().title("Burglary at Residential Complex — Sector 62, Noida").status("UNSOLVED")
                        .evidenceUrl("https://images.unsplash.com/photo-1509822929063-6b6cfc9b42f2?w=800&q=80")
                        .description("Three flats in Mahagun Moderne society, Sector 62, Noida were burgled between 10 PM and 2 AM on the night of Diwali when most residents were at community celebrations. Cash, jewellery, and electronics worth Rs 14 lakh were stolen. The burglars bypassed the electronic door locks using a signal jammer. Society CCTV shows two men entering through the service entrance using a cloned access card. A screwdriver with a partial fingerprint was left behind. Security guard logs show an unregistered visitor earlier that day.")
                        .createdBy(1L).build(),

                    // 11. Cyber Fraud - KYC Scam
                    Case.builder().title("Aadhaar KYC Scam — Ahmedabad").status("UNSOLVED")
                        .evidenceUrl("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80")
                        .description("A call centre operating from a rented office in Naranpura, Ahmedabad defrauded over 300 people across Gujarat by posing as UIDAI officials. Victims were told their Aadhaar was linked to illegal activities and would be deactivated unless they verified it immediately. They were asked to install AnyDesk remote access software, after which the fraudsters transferred money from their bank accounts. Total losses exceeded Rs 45 lakh. Police raided the office but found it abandoned with wiped computers. A local SIM card dealer was arrested for providing bulk SIMs.")
                        .createdBy(1L).build(),

                    // 12. Kidnapping for Ransom
                    Case.builder().title("Businessman's Son Kidnapping — Ludhiana").status("UNSOLVED")
                        .evidenceUrl("https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80")
                        .description("The 17-year-old son of a textile mill owner was abducted near his school in Model Town, Ludhiana on 3rd December while returning home. A ransom demand of Rs 50 lakh was received via a prepaid mobile number. The family paid Rs 20 lakh through a hawala channel as instructed but the boy was not released for 4 days. He was eventually found near Jalandhar bypass, dehydrated but unharmed. He described three captors speaking Haryanvi dialect. Voice samples from the ransom calls are under forensic analysis.")
                        .createdBy(1L).build(),

                    // 13. Cyber Stalking
                    Case.builder().title("Cyber Stalking and Blackmail — Kochi").status("UNSOLVED")
                        .evidenceUrl("https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80")
                        .description("A 24-year-old software professional in Kakkanad, Kochi reported being stalked online and blackmailed by an unknown individual who hacked her Instagram and email accounts in August. The hacker demanded Rs 2 lakh threatening to leak private photos to her workplace contacts. The victim's IP logs show unauthorised access from a VPN exit node in Bengaluru. A fake profile used to contact her was traced to a mobile number registered in a false name in Thrissur. Cybercrime police have issued notices to three internet service providers for subscriber data.")
                        .createdBy(1L).build(),

                    // 14. Petrol Pump Fraud
                    Case.builder().title("Petrol Pump Adulteration Racket — Jaipur").status("UNSOLVED")
                        .evidenceUrl("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80")
                        .description("A racket adulterating petrol with kerosene and solvent was uncovered at three fuel stations on Ajmer Road, Jaipur following consumer complaints of vehicle damage. Samples collected by the Weights and Measures department showed 30-40% adulteration. The fuel was being sourced from an unlicensed depot in Sanganer. CCTV at one pump showed staff switching dispensing units during night shifts. A tanker driver was arrested and revealed a network involving a petroleum depot manager and two pump owners. The main supplier remains unidentified.")
                        .createdBy(1L).build(),

                    // 15. Train Robbery
                    Case.builder().title("Passenger Robbery on Rajdhani Express — Madhya Pradesh").status("UNSOLVED")
                        .evidenceUrl("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80")
                        .description("Six passengers in coach B4 of the Mumbai-Delhi Rajdhani Express were robbed of cash and jewellery worth Rs 6.8 lakh while the train passed through Bhopal-Itarsi section at around 3 AM on 22nd November. Victims were sedated using a substance mixed into water bottles distributed by a fake pantry car attendant. RPF found the uniform of a pantry staff member abandoned in the toilet. Ticket records show four passengers who boarded at Bhopal did not have valid reservations. CCTV at Bhopal station is being reviewed.")
                        .createdBy(1L).build(),

                    // 16. Land Fraud
                    Case.builder().title("Fake Property Registration Scam — Hyderabad").status("UNSOLVED")
                        .evidenceUrl("https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80")
                        .description("A gang forged land registration documents and sold the same plot in Kompally, Hyderabad to four different buyers, collecting a total of Rs 1.8 crore. The fraudsters used forged Aadhaar cards and fabricated encumbrance certificates. A corrupt sub-registrar office employee allegedly facilitated the registrations. One buyer who visited the site found another family already constructing a house. Forensic document examination confirmed the signatures on three sale deeds were forged. The main accused fled to Dubai before the case was registered.")
                        .createdBy(1L).build(),

                    // 17. Acid Attack
                    Case.builder().title("Acid Attack Near Lajpat Nagar Metro, Delhi").status("UNSOLVED")
                        .evidenceUrl("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80")
                        .description("A 22-year-old woman was attacked with acid near Lajpat Nagar Metro Station exit gate 2 on the evening of 8th October at approximately 8:15 PM. The attacker, a man on foot, threw acid and fled into the crowded market. The victim sustained burns on her face and left arm and is undergoing treatment at AIIMS. Metro CCTV captured a man in a green jacket entering the station 4 minutes after the attack. A witness noted the attacker had a distinctive tattoo on his right forearm. The victim had previously filed a harassment complaint against an acquaintance.")
                        .createdBy(1L).build(),

                    // 18. Fake Currency
                    Case.builder().title("Fake Currency Circulation — Varanasi").status("UNSOLVED")
                        .evidenceUrl("https://images.unsplash.com/photo-1554672408-730436b60dde?w=800&q=80")
                        .description("High-quality counterfeit Rs 500 notes began circulating in the Vishwanath Gali and Godowlia market areas of Varanasi in March. Over Rs 3.2 lakh in fake currency was identified by shopkeepers and banks. The notes passed basic visual checks but failed UV and watermark tests. A currency exchange operator near Dashashwamedh Ghat was found with 200 fake notes and arrested. He claimed to have received them from a pilgrim group. Intelligence inputs suggest the notes were printed in a press operating near the Nepal border in Gorakhpur.")
                        .createdBy(1L).build(),

                    // 19. Extortion by Gang
                    Case.builder().title("Extortion Calls to Traders — Surat").status("UNSOLVED")
                        .evidenceUrl("https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80")
                        .description("Over 30 diamond and textile traders in Ring Road and Varachha area of Surat received extortion calls between May and July demanding Rs 5 lakh to Rs 25 lakh each under threat of attack. Two traders who refused had their shop shutters damaged. The calls originated from mobile numbers registered in Rajasthan using fake IDs. Voice analysis suggests the callers are operating from a jail facility. One trader secretly recorded a call and handed it to police. The gang is suspected to have links with an organised crime network based in Gujarat.")
                        .createdBy(1L).build(),

                    // 20. Cyber Fraud - Stock Market
                    Case.builder().title("Fake Stock Trading App Scam — Bengaluru").status("UNSOLVED")
                        .evidenceUrl("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80")
                        .description("A sophisticated stock market investment scam defrauded 85 IT professionals in Bengaluru's Koramangala and HSR Layout of Rs 4.7 crore between February and May. Victims were added to WhatsApp groups posing as SEBI-registered advisors and shown fabricated profit screenshots. They were directed to invest through a fake trading app that showed artificial gains. When victims tried to withdraw, they were asked to pay additional taxes. The app was hosted on servers in Hong Kong. Victims' funds were converted to USDT cryptocurrency and moved through multiple wallets.")
                        .createdBy(1L).build()
                );

                List<Case> saved = caseRepo.saveAll(cases);

                // ── Seed AI Clues ─────────────────────────────────
                clueRepo.saveAll(List.of(
                    // Case 1 - ATM Robbery Bangalore
                    Clue.builder().caseId(saved.get(0).getId()).userId(1L)
                        .clueText("Black Pulsar bike without number plate spotted on CCTV near Residency Road at 11:52 PM — matches witness description from two auto drivers.")
                        .isUnique(true).score(0.0).relevanceScore(92).createdAt(LocalDateTime.now()).build(),
                    Clue.builder().caseId(saved.get(0).getId()).userId(1L)
                        .clueText("Angle grinder cut pattern matches tools sold at a hardware shop in Shivajinagar — purchase records being reviewed.")
                        .isUnique(true).score(0.0).relevanceScore(85).createdAt(LocalDateTime.now()).build(),

                    // Case 2 - Chain Snatching Mumbai
                    Clue.builder().caseId(saved.get(1).getId()).userId(1L)
                        .clueText("Red Honda Activa with scratched rear mudguard and broken left indicator — RTO records show 3 matching vehicles registered in Andheri.")
                        .isUnique(true).score(0.0).relevanceScore(88).createdAt(LocalDateTime.now()).build(),
                    Clue.builder().caseId(saved.get(1).getId()).userId(1L)
                        .clueText("Partial fingerprint from victim's dupatta has 7 ridge points — being cross-matched with CCTNS database.")
                        .isUnique(true).score(0.0).relevanceScore(79).createdAt(LocalDateTime.now()).build(),

                    // Case 3 - UPI Fraud Hyderabad
                    Clue.builder().caseId(saved.get(2).getId()).userId(1L)
                        .clueText("SIM cards used in fraud registered with fake Aadhaar in Jharkhand — telecom provider flagged 14 numbers from same batch.")
                        .isUnique(true).score(0.0).relevanceScore(91).createdAt(LocalDateTime.now()).build(),
                    Clue.builder().caseId(saved.get(2).getId()).userId(1L)
                        .clueText("Mule accounts traced to a cooperative bank in Alwar, Rajasthan — account opened 3 days before first fraud reported.")
                        .isUnique(true).score(0.0).relevanceScore(86).createdAt(LocalDateTime.now()).build(),

                    // Case 4 - Missing Person Bangalore
                    Clue.builder().caseId(saved.get(3).getId()).userId(1L)
                        .clueText("Grey Swift Dzire near ITPL captured on petrol bunk CCTV — partial number plate MH-02 suggests Maharashtra registration.")
                        .isUnique(true).score(0.0).relevanceScore(89).createdAt(LocalDateTime.now()).build(),
                    Clue.builder().caseId(saved.get(3).getId()).userId(1L)
                        .clueText("Victim's phone last pinged a tower near Marathahalli bridge — cell tower data subpoena issued to Airtel.")
                        .isUnique(true).score(0.0).relevanceScore(94).createdAt(LocalDateTime.now()).build(),

                    // Case 5 - Hit and Run Delhi
                    Clue.builder().caseId(saved.get(4).getId()).userId(1L)
                        .clueText("Broken headlight casing at scene confirmed to be from Toyota Fortuner 2019-2022 model — 847 such vehicles registered in Delhi-NCR.")
                        .isUnique(true).score(0.0).relevanceScore(90).createdAt(LocalDateTime.now()).build(),
                    Clue.builder().caseId(saved.get(4).getId()).userId(1L)
                        .clueText("Toll plaza camera at Rajokri captured black Fortuner at 2:23 AM — front bumper visibly damaged, FASTag data being traced.")
                        .isUnique(true).score(0.0).relevanceScore(96).createdAt(LocalDateTime.now()).build()
                ));
            }
        };
    }
}
