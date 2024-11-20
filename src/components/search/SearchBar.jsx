import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function SearchBar({ onSearch, onCategoryChange }) {
	return (
		<div className="flex gap-4 w-full max-w-3xl mx-auto">
			<div className="relative flex-1">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
				<Input
					className="pl-10"
					placeholder="Search CnC..."
					onChange={(e) => onSearch(e.target.value)}
				/>
			</div>
			<Select onValueChange={onCategoryChange}>
				<SelectTrigger className="w-[180px]">
					<SlidersHorizontal className="mr-2 h-4 w-4" />
					<SelectValue placeholder="Category" />
				</SelectTrigger>
				<SelectContent className="font-[Geist]">
					<SelectItem value="all">All Categories</SelectItem>
					<SelectItem value="technology">Technology</SelectItem>
					<SelectItem value="sports">Sports</SelectItem>
					<SelectItem value="arts">Arts</SelectItem>
					<SelectItem value="education">Education</SelectItem>
					<SelectItem value="other">Other</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
