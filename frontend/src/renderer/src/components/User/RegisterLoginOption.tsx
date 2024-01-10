import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { useState } from "react"
import Login from "./Login"
import Register from "./Register"

export default function RegisterLoginOption() {
	const [showLogin, setShowLogin] = useState(false)
	const [showRegister, setShowRegister] = useState(false)

	const handleShowLogin = () => {
		setShowRegister(false)
		setShowLogin(true)
	}

	const handleShowRegister = () => {
		setShowLogin(false)
		setShowRegister(true)
	}

	const close = () => {
		setShowLogin(false)
		setShowRegister(false)
	}

	return (
		<div>
			<div>
				<Modal isOpen={true} className="bg-surface-200">
					<ModalContent>
						<>
							<ModalHeader className="flex flex-col gap-1">
								Welcome to ChatApp
							</ModalHeader>
							<ModalBody>
								<Button onPress={handleShowLogin} className="bg-surface-300">
									Login
								</Button>
								<Button onPress={handleShowRegister} className="bg-surface-300">
									Register
								</Button>
							</ModalBody>
							<ModalFooter></ModalFooter>
						</>
					</ModalContent>
				</Modal>
				{showLogin && <Login onClose={close} />}
				{showRegister && <Register onClose={close} />}
			</div>
		</div>
	)
}
