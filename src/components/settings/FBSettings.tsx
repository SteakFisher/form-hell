import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SettingsObject } from "@/types/Settings";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import FormAccessTable from "./FormAccessTable";

type FBSettingsProps = {
	settingsObj: SettingsObject;
};

export default function FBSettings({ settingsObj }: FBSettingsProps) {
	const SavedSettingsObj = { ...settingsObj };

	return (
		<div className="flex justify-center pt-10">
			<Card className="w-[900px] text-sm font-medium">
				<CardHeader className="pb-4">
					<CardTitle className="mb-10 text-3xl font-normal">
						Settings
					</CardTitle>
					<Separator className="h-[0.5px]" />
				</CardHeader>
				<CardContent>
					<Setting className="pt-0">
						<Label className="pr-2" htmlFor="accept-responses">
							Accept responses
						</Label>
						<Switch id="accept-responses" />
					</Setting>
					<Setting>
						<FormAccessTable formAccessMap={settingsObj.formAccess} />
					</Setting>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button variant="destructive">Revert Changes</Button>
					<Button>Save Changes</Button>
				</CardFooter>
			</Card>
		</div>
	);
}

function Setting({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<>
			<div className={cn("flex items-center py-3", className)}>
				{children}
			</div>
			<Separator className="h-[1px]" />
		</>
	);
}
