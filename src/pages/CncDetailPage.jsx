import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/layout/Footer';
import bwf from "@/assets/bwf.png"

const cncs = [
  {
    id: 1,
    name: 'Robotics Club',
    category: 'Technology',
    description: 'Build and program robots for competitions and research projects.',
    longDescription:
      "The Robotics Club at President University is a hub for innovation and technological advancement. Our members work on cutting-edge robotics projects, participate in national and international competitions, and collaborate with industry partners to solve real-world problems. Whether you're a beginner or an experienced engineer, there's a place for you in our community of tech enthusiasts.",
    image: bwf,
    members: 42,
    events: [
      { name: 'Annual Robotics Showcase', date: '2024-05-15', location: 'Main Auditorium' },
      { name: "Beginner's Workshop: Intro to Arduino", date: '2024-03-10', location: 'Tech Lab 101' },
      { name: 'Regional Robotics Competition Prep', date: '2024-04-20', location: 'Engineering Building' }
    ],
    achievements: [
      '1st Place in National University Robotics Challenge 2023',
      'Published research paper on swarm robotics in IEEE Robotics Journal',
      'Successful collaboration with local industries for internship placements'
    ]
  },
  {
    id: 2,
    name: 'Art Society',
    category: 'Arts',
    description: 'Express yourself through various art forms and exhibitions.',
    longDescription:
      'The Art Society is a vibrant community of creative individuals who come together to explore, create, and showcase various forms of art. From painting and sculpture to digital art and performance, we provide a platform for artists of all levels to develop their skills, collaborate on projects, and exhibit their work to the university community and beyond.',
    image: bwf,
    members: 78,
    events: [
      { name: 'Annual Art Exhibition', date: '2024-06-01', location: 'University Gallery' },
      { name: 'Watercolor Workshop', date: '2024-03-25', location: 'Art Studio' },
      { name: 'Open Mic Night: Performance Art', date: '2024-04-15', location: 'Student Center' }
    ],
    achievements: [
      'Curated successful charity art auction raising $10,000 for local causes',
      "Members' work featured in citywide art festival",
      'Collaborative mural project beautifying campus buildings'
    ]
  },
  {
    id: 3,
    name: 'President University Badminton Club',
    category: 'Sports',
    description: 'Play and improve your badminton skills with fellow enthusiasts.',
    longDescription:
      'The President University Badminton Club is a dynamic community of badminton enthusiasts. We offer a supportive environment for players of all levels, from beginners to seasoned players. Whether you\'re looking to sharpen your skills, join a team, or simply enjoy the sport, our club provides opportunities for you to excel and have fun.',
    image: bwf,
    members: 30,
    events: [
      { name: 'Monthly Badminton Tournament', date: '2024-05-15', location: 'Sports Hall' },
      { name: 'Beginner Training Session', date: '2024-03-10', location: 'Sports Hall' },
      { name: 'Inter-University Badminton League', date: '2024-04-20', location: 'Sports Hall' }
    ],
    achievements: [
      'Won the National University Badminton Championship 2023',
      'Organized successful inter-university badminton league',
    ]
  }
];

export default function CncDetailPage() {
  const params = useParams();
  const cncId = parseInt(params.id);
  const cnc = cncs.find(c => c.id === cncId);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden font-[Geist]">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all CnCs
        </Link>

        <Card className="mb-8">
          <img src={cnc.image} alt={cnc.name} className="w-full h-64 object-cover rounded-t-lg" />
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold">{cnc.name}</CardTitle>
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                {cnc.category}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{cnc.longDescription}</p>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Users className="mr-2 h-4 w-4" />
              <span>{cnc.members} members</span>
            </div>
            <Button className="w-full sm:w-auto">Join this CnC</Button>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {cnc.events.map((event, index) => (
                <li key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                  <h4 className="font-semibold">{event.name}</h4>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Notable Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {cnc.achievements.map((achievement, index) => (
                <li key={index} className="text-gray-600">{achievement}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <Footer  />
    </div>
  );
}
