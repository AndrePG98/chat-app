import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { useState } from "react"
import Login from "../Login"
import Register from "../Register"

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

	return (
		<div>
			<div>
				<Modal isOpen={true}>
					<ModalContent>
						<>
							<ModalHeader className="flex flex-col gap-1">
								Welcome to ChatApp
							</ModalHeader>
							<ModalBody>
								<Button onPress={handleShowLogin}>Login</Button>
								<Button onPress={handleShowRegister}>Register</Button>
							</ModalBody>
							<ModalFooter></ModalFooter>
						</>
					</ModalContent>
				</Modal>
				{showLogin && <Login></Login>}
				{showRegister && <Register></Register>}
			</div>
		</div>
	)
}
