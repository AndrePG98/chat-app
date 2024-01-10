import { Accordion, AccordionItem, Listbox, ListboxItem, Spinner } from '@nextui-org/react'
import { ChangeEvent, useEffect, useState } from 'react'

export default function DeviceSelector() {
	const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([])
	const [outputDevices, setOutputDevices] = useState<MediaDeviceInfo[]>([])
	const [selectedInputDevice, setSelectedInputDevice] = useState<MediaDeviceInfo>()
	const [selectedOutputDevice, setSelectedOutputDevice] = useState<MediaDeviceInfo>()
	const [isLoading, setIsLoading] = useState(true)

	const handleAudioInput = (device: MediaDeviceInfo) => {
		localStorage.setItem('selectedInputDevice', device.deviceId)
		setSelectedInputDevice(device)
	}

	const handleAudioOutput = (device: MediaDeviceInfo) => {
		localStorage.setItem('selectedOutputDevice', device.deviceId)
		setSelectedOutputDevice(device)
	}

	useEffect(() => {
		navigator.mediaDevices
			.enumerateDevices()
			.then(function (devices) {
				const input: MediaDeviceInfo[] = []
				const output: MediaDeviceInfo[] = []
				devices.forEach((device) => {
					if (device.kind === 'audioinput') {
						input.push(device)
					} else if (device.kind === 'audiooutput') {
						output.push(device)
					}
				})
				setInputDevices(input)
				setOutputDevices(output)

				const savedInputDevice = localStorage.getItem('selectedInputDevice')
				const savedOutputDevice = localStorage.getItem('selectedOutputDevice')
				if (savedInputDevice) {
					const device = devices.find((device) => {
						return device.deviceId === savedInputDevice
					})
					setSelectedInputDevice(device)
				}
				if (savedOutputDevice) {
					const device = devices.find((device) => {
						return device.deviceId === savedOutputDevice
					})
					setSelectedOutputDevice(device)
				}
				setIsLoading(false)
			})
			.catch(function (err) {
				console.log(err.name + ': ' + err.message)
				setIsLoading(false)
			})
	}, [])

	if (isLoading) {
		return <Spinner />
	}

	return (
		<div className="flex flex-row w-full items-center justify-center">
			<Accordion isCompact variant="light" className="px-0">
				<AccordionItem key={1} aria-label="Input" title={selectedInputDevice?.label}>
					<Listbox>
						{inputDevices.map((device) => (
							<ListboxItem
								aria-label={device.label}
								key={device.deviceId}
								onClick={() => {
									handleAudioInput(device)
								}}
							>
								{device.label}
							</ListboxItem>
						))}
					</Listbox>
				</AccordionItem>
				<AccordionItem key={2} aria-label="Output" title={selectedOutputDevice?.label}>
					<Listbox>
						{outputDevices.map((device) => (
							<ListboxItem
								aria-label={device.label}
								key={device.deviceId}
								onClick={() => {
									handleAudioOutput(device)
								}}
							>
								{device.label}
							</ListboxItem>
						))}
					</Listbox>
				</AccordionItem>
			</Accordion>
		</div>
	)
}
