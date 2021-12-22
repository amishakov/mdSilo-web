import Link from 'next/link';
import { IconArrowRight, IconMarkdown } from '@tabler/icons';
import Footer from 'components/landing/Footer';
import Navbar from 'components/landing/Navbar';
import MainView from 'components/landing/MainView';

export default function Home() {
  return (
    <MainView showNavbar={false} showFooter={false}>
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 border-b-2 border-gray-600">
          <div className="shadow-sm">
            <Navbar />
            <div className="py-16 md:py-24">
              <div className="container px-6 text-center">
                <h1 className="text-4xl font-semibold leading-tight md:leading-tight md:text-5xl">
                  Promise to Network Minds Better.
                </h1>
                <Link href="/app">
                  <a className="inline-flex items-center mt-6 md:mt-8 btn hover:shadow-lg group">
                    <IconMarkdown size={18} className="mx-1 group-hover:animate-bounce-x" />
                    {'  Start Writing '}
                    <IconArrowRight size={18} className="ml-1 group-hover:animate-bounce-x" />
                  </a>
                </Link>
                <p className="max-w-3xl pt-6 mx-auto text-xl md:pt-8 md:text-2xl">
                  mdSilo is the silo for storing ideas with a powerful networked-writing app, privacy-first and work offline well.
                </p>
                <Link href="/app/demo">
                  <a className="inline-flex mt-2 link hover:shadow-lg">
                    Live Demo
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="py-8 md:py-16">
          <div className="container px-6">
            <h2 className="text-3xl font-semibold text-center md:text-4xl">
              mdSilo as a buffering for your daily I/O
            </h2>
            <div className="grid gap-6 pt-6 md:pt-8 md:grid-cols-3">
              <div className="p-8 rounded-md shadow bg-gray-600 border-l-4 border-green-600">
                <h3 className="text-xl font-semibold">
                  Enjoy Writing
                </h3>
                <p className="pt-1">Real-time WYSIWYG writing</p>
                <p className="pt-1">Slash commands, Toolbar, Hotkeys</p>
                <p className="pt-1">Import and Export (Markdown, json)</p>
                <p className="pt-1">Local File Access<sup className="text-xs text-gray-500">*Chrome/Edge...</sup></p>
              </div>
              <div className="p-8 rounded-md shadow bg-gray-600 border-l-4 border-blue-600">
                <h3 className="text-xl font-semibold">
                  Connect Everyting
                </h3>
                <p className="pt-1">(( Block Reference ))</p>
                <p className="pt-1">[[ Bidirection BackLink ]]</p>
                <p className="pt-1">{`{{ PubLink to liaison points }}`}</p>
                <p className="pt-1">{`#HashTag and ( External Link )`}</p>
              </div>
              <div className="p-8 rounded-md shadow bg-gray-600 border-l-4 border-yellow-600">
                <h3 className="text-xl font-semibold">
                  View Different
                </h3>
                <p className="pt-1">Stacking View</p>
                <p className="pt-1">Chronicle View</p>
                <p className="pt-1">Graph View</p>
                <p className="pt-1">Task View</p>
              </div>
              <div className="p-8 rounded-md shadow bg-gray-600 border-l-4 border-purple-600">
                <h3 className="text-xl font-semibold">
                  Reading Companion
                </h3>
                <p className="pt-1">Collect Reading list</p>
                <p className="pt-1">Jot down the inspiration instantly</p>
                <p className="pt-1">Track the accomplishments and keep promises.</p>
              </div>
              <div className="p-8 rounded-md shadow bg-gray-600 border-l-4 border-red-600">
                <h3 className="text-xl font-semibold">
                  Personal knowledge Silo
                </h3>
                <p className="pt-1">
                  Store the ideas, thoughts, knowledge in the networked way and 
                  view them from different perspective.
                </p>
              </div>
              <div className="p-8 rounded-md shadow bg-gray-600 border-l-4 border-pink-600">
                <h3 className="text-xl font-semibold">Document own life</h3>
                <p className="pt-2">
                  Markdown our lives locally, the data even can sit in a single json file.
                </p>
                <p className="pt-2 text-xs text-gray-500">
                  *a Desktop App is coming soon. 
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer className={''} />
      </div>
    </MainView>
  );
}
