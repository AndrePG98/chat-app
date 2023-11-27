'use client'

import { Button, Card, CardBody, CardHeader, Image, Input } from "@nextui-org/react";
import { useState } from 'react';

export default function LoginCard() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginButtonPressed, setLoginButtonPressed] = useState(false);

    const isUserValid = true;
    const isPasswordCorrect = true;


    function handleLogin() {
        setLoginButtonPressed(true);

        if (isUserValid && isPasswordCorrect) {
            console.log('Login successful!');
        } else {
            console.error('Login failed. Please check your credentials.');
        }
    };

    return (
        <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny">Welcome back</p>
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
                        isInvalid={loginButtonPressed && (!isUserValid || !isPasswordCorrect)}
                        variant="bordered"
                        placeholder="Password"
                        errorMessage={
                            loginButtonPressed && (!isUserValid || !isPasswordCorrect)
                                ? "Login details do not match any user"
                                : undefined
                        }
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <Button
                    className="max-w-xs mt-6"
                    onClick={() => handleLogin()}>
                    Login
                </Button>
            </CardBody>
        </Card>
    );
}