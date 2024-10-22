import type { Router } from "express";
import type { ExtensionRepository } from "../repositories/extension";
import AbstractService from "./abstract";

export class ExtensionServices extends AbstractService {
	public repository: ExtensionRepository;

	constructor(parent: Router, repository: ExtensionRepository) {
		super(parent);
		this.repository = repository;
	}

	getBasePath() {
		return "extensions";
	}
}
