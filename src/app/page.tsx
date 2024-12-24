"use client"

import { Project } from "@/lib/project/project.interface";
import { useEffect, useState } from "react";
import { ProjectLocalStorageService } from "../lib/project/project-local-storage.service";

export default function Home() {
	const projectLocalStorageService = new ProjectLocalStorageService();

	const [projects, setProjects] = useState<Project[] | null | undefined>(null);

	useEffect(() => {
		setProjects(projectLocalStorageService.get());
		// projectLocalStorageService.save([{
		// 	name: "Teste",
		// 	email: "9o3XH@example.com",
		// 	jira: {
		// 		url: "http://localhost:8080",
		// 		apiKey: "test"
		// 	}
		// }]);
	}, [])

	if(projects === null) {
		return <h1>NULL</h1>;	
	}
	return <h1>TESTE</h1>;
}
