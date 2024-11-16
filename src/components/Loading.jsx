"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Loading() {
	const [rotation, setRotation] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setRotation((prev) => (prev + 30) % 360);
		}, 100);

		return () => clearInterval(interval);
	}, []);

	const spinnerVariants = {
		animate: {
			rotate: rotation,
			transition: {
				duration: 0.3,
				ease: "easeInOut",
			},
		},
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm z-50">
			<div className="text-center">
				<motion.div
					className="inline-block"
					variants={spinnerVariants}
					animate="animate"
				>
					<svg
						className="w-16 h-16 text-gray-900"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20Z"
							fill="currentColor"
							fillOpacity="0.2"
						/>
						<path
							d="M12 2C6.47715 2 2 6.47715 2 12H4C4 7.58172 7.58172 4 12 4V2Z"
							fill="currentColor"
						/>
					</svg>
				</motion.div>
				<motion.div
					className="mt-4 space-x-1 text-xl font-semibold text-gray-900"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<span>Loading</span>
					<motion.span
						initial={{ opacity: 0 }}
						animate={{ opacity: [0, 1, 0] }}
						transition={{
							duration: 1.5,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					>
						.
					</motion.span>
					<motion.span
						initial={{ opacity: 0 }}
						animate={{ opacity: [0, 1, 0] }}
						transition={{
							duration: 1.5,
							repeat: Infinity,
							ease: "easeInOut",
							delay: 0.2,
						}}
					>
						.
					</motion.span>
					<motion.span
						initial={{ opacity: 0 }}
						animate={{ opacity: [0, 1, 0] }}
						transition={{
							duration: 1.5,
							repeat: Infinity,
							ease: "easeInOut",
							delay: 0.4,
						}}
					>
						.
					</motion.span>
				</motion.div>
			</div>
		</div>
	);
}
