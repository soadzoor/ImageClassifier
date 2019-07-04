import * as mobilenet from "@tensorflow-models/mobilenet";

export class DropManager
{
	private _domElement: HTMLElement;
	private _uploadedImage: HTMLElement;
	private _uploadArea: HTMLElement;
	private _inputElement: HTMLInputElement;
	private _guessMessage: HTMLElement;
	private _model: mobilenet.MobileNet;

	constructor(domElement: HTMLElement)
	{
		this._domElement = domElement;
		this._inputElement = document.createElement('input');
		this._inputElement.type = 'file';
		this._inputElement.accept = 'image/*'
		this._inputElement.addEventListener('change', (event: Event) =>
		{
			const file = this._inputElement.files[0];
			this.processFile(file);
		});

		this._uploadedImage = document.getElementById('uploadedImage');
		this._uploadArea = document.getElementById('uploadArea');
		this._guessMessage = document.getElementById('guessMessage');

		this.initNeuralNetwork();
	}

	private async initNeuralNetwork()
	{
		this._model = await mobilenet.load();


		document.addEventListener('dragover', (event: Event) =>
		{
			event.preventDefault();
		});

		this._domElement.addEventListener('drop', (event: DragEvent) =>
		{
			event.preventDefault();

			const file = event.dataTransfer.files[0];
			this.processFile(file);
		});

		this._uploadArea.addEventListener('click', () =>
		{
			this._inputElement.click();
		});

		document.getElementById('loadingDiv').classList.add('hidden');
		this._domElement.classList.remove('hidden');
	}

	private updateGuessMessage(prediction: {className: string, probability: number})
	{
		const percentage = Math.round((prediction.probability * 100));

		const pos = prediction.className.lastIndexOf(',');
		const classNames = pos > -1 ? `${prediction.className.substring(0, pos)} or${prediction.className.substring(pos + 1)}` : prediction.className;
		this._guessMessage.innerHTML = `I'm ${percentage}% sure that I can see a(n) <strong>${classNames}</strong>.`;
		this._guessMessage.classList.remove('invisible');
	}

	private processFile(file: File)
	{
		if (file)
		{
			const img = document.createElement('img');
			img.onload = async () =>
			{
				const predictions = await this._model.classify(img, 1);
				this._uploadedImage.style.width = `${img.width}px`;
				this._uploadedImage.style.backgroundImage = `url(${img.src}`;
				this._uploadedImage.classList.remove('invisible');
				this.updateGuessMessage(predictions[0]);
			};
			img.src = URL.createObjectURL(file);
		}
	}
}