import Link from 'next/link';
import Image from 'next/image';

const CTA = () => {
  return (
    <section className="py-16 md:py-24 bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Split Bills Without the Hassle?
            </h2>
            <p className="text-xl mb-8 text-indigo-100">
              Join thousands of users who have made splitting bills easier with SplitApp. Sign up today and get started for free.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/signup" className="btn bg-white text-primary hover:bg-indigo-100">
                Get Started For Free
              </Link>
              <Link href="/contact" className="btn border border-white text-white hover:bg-indigo-700">
                Contact Sales
              </Link>
            </div>
            <div className="mt-8">
              <p className="text-indigo-200 mb-4">Available on all devices</p>
              <div className="flex space-x-4">
                <Link href="/download/ios" className="hover:opacity-90">
                  <Image
                    src="/images/app-store-badge.png"
                    alt="Download on the App Store"
                    width={140}
                    height={42}
                  />
                </Link>
                <Link href="/download/android" className="hover:opacity-90">
                  <Image
                    src="/images/google-play-badge.png"
                    alt="Get it on Google Play"
                    width={140}
                    height={42}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="relative h-80 md:h-96">
            <Image
              src="/images/mobile-app-mockup.png"
              alt="SplitApp on mobile"
              className="rounded-lg shadow-2xl"
              fill
              style={{objectFit: 'contain'}}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
