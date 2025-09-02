import { Accordion } from '../../../components/shared/data-display/accordion';
import { Heading } from '../../../components/shared/typography/heading';
import { Paragraph } from '../../../components/shared/typography/paragraph';
import { Text } from '../../../components/shared/typography/text';

const FAQ = () => {
    const faqs = [
        {
            question: 'How secure is Stargate?',
            answer: 'Stargate employs enterprise-grade security measures including end-to-end encryption, advanced authentication protocols, and regular security audits to ensure your data is always protected.'
        },
        {
            question: 'Can I use Stargate on mobile devices?',
            answer: 'Yes, Stargate provides a responsive design that works seamlessly across all devices including smartphones, tablets, and desktops. We also offer dedicated mobile apps for iOS and Android.'
        },
        {
            question: 'What kind of support do you offer?',
            answer: 'We provide comprehensive support including 24/7 customer service, detailed documentation, video tutorials, and a community forum. Enterprise customers also receive dedicated account managers.'
        },
        {
            question: 'How quickly can I get started?',
            answer: 'You can create an account and start using Stargate in less than 5 minutes. We offer free trial periods and step-by-step onboarding guides to help you get up and running quickly.'
        },
        {
            question: 'Is there a free plan available?',
            answer: 'Yes, we offer a generous free plan that includes all core features with limitations on usage and storage. Paid plans provide unlimited usage, premium support, and advanced features.'
        }
    ];

    return (
        <section className="py-16 px-4" style={{ background: 'rgba(0, 0, 0, 0.4)' }}>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <Heading
                        as="h2"
                        variant="h2"
                        className="mb-4 text-white animate-hologram font-asimovian"
                        style={{
                            textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4)',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase'
                        }}
                    >
                        Frequently Asked Questions
                    </Heading>
                    <Paragraph
                        size="lg"
                        className="max-w-2xl mx-auto text-purple-200 font-orbitron"
                        style={{
                            textShadow: '0 0 10px rgba(147, 51, 234, 0.6)'
                        }}
                    >
                        Got questions? We've got answers. Here are some of the most common questions about Stargate.
                    </Paragraph>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <Accordion
                            key={index}
                            trigger={
                                <Text size="lg" className="font-medium font-asimovian text-purple-200">
                                    {faq.question}
                                </Text>
                            }
                        >
                            <Text className="leading-relaxed font-orbitron text-white">
                                {faq.answer}
                            </Text>
                        </Accordion>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;