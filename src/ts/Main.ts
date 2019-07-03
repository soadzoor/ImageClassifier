import { DropManager } from 'view/DropManager';

export class Main
{
	public static instance: Main;
	public static getInstance(): Main
	{
		return Main.instance || new Main();
	}

	private _dropManager: DropManager;

	constructor()
	{
		Main.instance = this;

		this._dropManager = new DropManager(document.getElementById('playGround'));
	}
}

const main = Main.getInstance();