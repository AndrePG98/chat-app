'use client'

import { Button, Card, CardBody, CardHeader, Image, Input } from "@nextui-org/react";
import { useState } from 'react';

export default function RegisterCard() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerButtonPressed, setRegisterButtonPressed] = useState(false);

    const isAtLeast8CharsLong = password.length >= 8;
    const hasUpperCaseChar = /[A-Z]/.test(password);
    const hasLowerCaseChar = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const passwordMeetsReqs = isAtLeast8CharsLong && hasUpperCaseChar && hasLowerCaseChar && hasSpecialChar;

    function handleRegister() {
        setRegisterButtonPressed(true);
        console.log("here");
        console.log(!passwordMeetsReqs);
        console.log(registerButtonPressed);

        if (passwordMeetsReqs) {
            console.log('Register successful!');
        } else {
            console.error('Register failed. Please check your credentials.');
        }
    }

    return (
        <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny">Welcome</p>
            </CardHeader>
            <CardBody className="overflow-visible py-2 justify-center">
                <Image
                    alt="Card background"
                    className="object-cover rounded-xl mb-5"
                    src="https://static.vecteezy.com/system/resources/thumbnails/007/033/146/small/profile-icon-login-head-icon-vector.jpg"
                    width={210}
                />
                <div className="space-y-1.5">
                    <Input
                        placeholder="Username"
                        variant="bordered"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input
                        type="password"
                        isInvalid={!passwordMeetsReqs && registerButtonPressed}
                        variant="bordered"
                        placeholder="Password"
                        errorMessage={registerButtonPressed && !passwordMeetsReqs ? "Password does not meet the requirements." : undefined}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <Button
                    className="max-w-xs mt-5"
                    onClick={() => handleRegister()}>
                    Register
                </Button>
            </CardBody>
        </Card>
    );
}
