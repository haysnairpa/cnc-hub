"use client";

import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Calendar, MapPin, Check, Loader2, X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { useEffect, useState } from "react";
import {
	collection,
	getDoc,
	doc,
	getDocs,
	updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { motion } from "framer-motion";
import Loading from "@/components/Loading";
import NotFound from "@/components/not-found/NotFound";
import { useAuth } from "@/components/contexts/AuthContext";
import { useToast } from "@/components/hooks/use-toast";

export default function CncDetailPage() {
	const params = useParams();
	const cncId = params.id;
	const navigate = useNavigate();

	const { toast } = useToast();

	const { userData } = useAuth();
	const isAdmin = userData?.role === "admin";

	const [community, setCommunity] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [membershipStatus, setMembershipStatus] = useState("not_member");

	const getCommunityById = async () => {
		setIsLoading(true);
		try {
			const docRef = doc(collection(db, "communities"), cncId);
			const res = await getDoc(docRef);
			if (res.exists()) {
				const { image, name, description, leader, members, category } =
					res.data();
				setCommunity({
					id: res.id,
					image,
					name,
					description,
					leader,
					members,
					category,
					registrationOpen: res.data()?.registrationOpen || false,
				});

				const eventRes = await getDocs(
					collection(db, `communities/${res.id}/events`)
				);

				const filteredEvent = eventRes?.docs.map((ev) => ({
					...ev.data(),
				}));
				setCommunity((prev) => ({ ...prev, events: filteredEvent }));
			} else {
				console.log("No such document!");
			}
		} catch (error) {
			console.error("Error getting document:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const joinCommunity = async () => {
		if (!userData) {
		  toast({
			variant: "destructive",
			title: "You Need to Login First!",
		  });
		  return;
		}
	
		setIsUpdating(true);
		try {
		  let newMembers;
		  if (membershipStatus === "not_member") {
			newMembers = [
			  ...community.members,
			  {
				studentId: userData.studentId,
				status: "pending",
			  },
			];
		  } else if (membershipStatus === "pending") {
			newMembers = community.members.filter(member => member.studentId !== userData.studentId);
		  }
	
		  await updateDoc(doc(db, "communities", cncId), {
			members: newMembers,
		  });
	
		  setCommunity(prev => ({ ...prev, members: newMembers }));
		  setMembershipStatus(membershipStatus === "not_member" ? "pending" : "not_member");
	
		  toast({
			title: membershipStatus === "not_member" ? "Join request sent!" : "Join request cancelled",
		  });
		} catch (error) {
		  console.log(error);
		  toast({
			variant: "destructive",
			title: "Error updating membership",
		  });
		} finally {
		  setIsUpdating(false);
		}
	  };

	useEffect(() => {
		if (isAdmin && !isLoading) {
			navigate("/admin");
		}
	}, [userData]);

	useEffect(() => {
		getCommunityById();
	}, []);

	useEffect(() => {
		if (community && userData) {
		  const userMembership = community.members.find(member => member.studentId === userData.studentId);
		  if (userMembership) {
			setMembershipStatus(userMembership.status);
		  } else {
			setMembershipStatus("not_member");
		  }
		}
	  }, [community, userData]);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
		},
	};

	if (isLoading) {
		return <Loading />;
	}

	if (!community) {
		return <NotFound />;
	}

	return (
		<div className="min-h-screen bg-gray-100 overflow-x-hidden font-[Geist]">
			<Navbar />
			<motion.div
				initial="hidden"
				animate="visible"
				variants={containerVariants}
				className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
			>
				<motion.div variants={itemVariants} className="mb-12">
					<h1 className="text-5xl font-bold text-gray-900 mb-4">
						{community?.name}
					</h1>
					<p className="text-xl text-gray-600 mb-6">
						{community?.description}
					</p>
					<div className="flex items-center text-gray-600 mb-6">
						<Users className="mr-2 h-5 w-5" />
						<span className="text-lg">
							{community?.members?.filter(
								(member) => member.status === "member"
							).length + 1}{" "}
							members
						</span>
					</div>

					{membershipStatus === "member" && (
        <Button className="text-lg px-8 py-6" variant="secondary" disabled>
          <Check className="mr-2 h-5 w-5" />
          You're a member
        </Button>
      )}
      {membershipStatus === "pending" && (
        <Button className="text-lg px-8 py-6" variant="outline" onClick={joinCommunity} disabled={isUpdating}>
          {isUpdating ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <X className="mr-2 h-5 w-5" />
          )}
          Cancel join request
        </Button>
      )}
      {membershipStatus === "not_member" && (
        <Button className="text-lg px-8 py-6" onClick={joinCommunity} disabled={isUpdating}>
          {isUpdating ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <UserPlus className="mr-2 h-5 w-5" />
          )}
          Join this CnC
        </Button>
      )}

				</motion.div>

				<motion.div variants={itemVariants} className="mb-12">
					<Card className="overflow-hidden">
						<img
							src={community?.image}
							alt={community?.name}
							className="w-full h-96 object-cover"
						/>
					</Card>
				</motion.div>

				<motion.div variants={itemVariants}>
					<Card className="mb-12">
						<CardHeader>
							<CardTitle className="text-3xl font-bold text-gray-900">
								Communities Events
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-6">
								{community?.events?.map((event, index) => (
									<motion.li
										key={index}
										variants={itemVariants}
										className="border-b last:border-b-0 pb-6 last:pb-0"
									>
										<h4 className="text-xl font-semibold text-gray-900 mb-2">
											{event.eventName}
										</h4>
										<div className="flex items-center text-gray-600 mb-1">
											<Calendar className="mr-2 h-5 w-5" />
											<span className="text-lg">
												{event.date}
											</span>
										</div>
										<div className="flex items-center text-gray-600">
											<MapPin className="mr-2 h-5 w-5" />
											<span className="text-lg">
												{event.place}
											</span>
										</div>
									</motion.li>
								))}
							</ul>
						</CardContent>
					</Card>
				</motion.div>
			</motion.div>
			<Footer />
		</div>
	);
}
