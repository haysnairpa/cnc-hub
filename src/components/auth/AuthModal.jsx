import { useState } from "react";
import { auth, db } from "@/config/firebase";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import {
	collection,
	doc,
	getDocs,
	query,
	setDoc,
	where,
} from "firebase/firestore";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/contexts/AuthContext";
import { User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export function AuthModal() {
	const { user, signOut, userData } = useAuth();
	const [isRegister, setIsRegister] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fullName, setFullName] = useState("");
	const [studentId, setStudentId] = useState("");
	const [error, setError] = useState("");
	const [open, setOpen] = useState(false);

	const { isLoading, loadingFromAuth } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			if (isRegister) {
				if (studentId.length < 12) {
					setError("Student ID must be at least 12 digits");
					return;
				}

				// Query Firestore to check if the studentId exists
				const q = query(
					collection(db, "users"),
					where("studentId", "==", studentId)
				);
				const querySnapshot = await getDocs(q);

				if (!querySnapshot.empty) {
					setError("Student ID is already in use");
					return;
				}

				const userCredential = await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);
				await setDoc(doc(db, "users", userCredential.user.uid), {
					fullName,
					studentId,
					email,
					role: "user",
					createdAt: new Date().toISOString(),
				});
			} else {
				await signInWithEmailAndPassword(auth, email, password);
			}
			setOpen(false);
		} catch (err) {
			setError(err.message);
		}
	};

	if (userData) {
		return (
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="icon" asChild>
					<Link
						to={userData?.role === "admin" ? "/admin" : "/profile"}
					>
						<User className="h-5 w-5" />
					</Link>
				</Button>
				<Button variant="ghost" size="icon" onClick={() => signOut()}>
					<LogOut className="h-5 w-5" />
				</Button>
			</div>
		);
	}

	if (isLoading || loadingFromAuth) return;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Login</Button>
			</DialogTrigger>
			<DialogContent className="font-[Geist]">
				<DialogHeader>
					<DialogTitle>
						{isRegister ? "Register" : "Login"}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					{isRegister && (
						<>
							<div>
								<Label htmlFor="fullName">Full Name</Label>
								<Input
									id="fullName"
									value={fullName}
									onChange={(e) =>
										setFullName(e.target.value)
									}
									required={isRegister}
								/>
							</div>
							<div>
								<Label htmlFor="studentId">Student ID</Label>
								<Input
									id="studentId"
									value={studentId}
									onChange={(e) =>
										setStudentId(e.target.value)
									}
									required={isRegister}
									minLength={12}
									pattern="\d{12,}"
									title="Student ID must be at least 12 digits"
								/>
							</div>
						</>
					)}
					<div>
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div>
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					{error && <p className="text-sm text-red-500">{error}</p>}
					<Button type="submit" className="w-full">
						{isRegister ? "Register" : "Login"}
					</Button>
					<p className="text-center text-sm">
						{isRegister
							? "Already have an account? "
							: "Don't have an account? "}
						<button
							type="button"
							onClick={() => setIsRegister(!isRegister)}
							className="text-blue-500 hover:underline"
						>
							{isRegister ? "Login" : "Register"}
						</button>
					</p>
				</form>
			</DialogContent>
		</Dialog>
	);
}
