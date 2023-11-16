import React from "react";
import { Card, CardHeader, CardBody, Image, Button, Textarea } from "@nextui-org/react";

export default function RegisterPage() {
    return (
        <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny">Welcome Back</p>
            </CardHeader>
            <CardBody className="overflow-visible py-2 justify-center">
                <Image
                    alt="Card background"
                    className="object-cover rounded-xl mt-2 mb-2"
                    src="https://static.vecteezy.com/system/resources/thumbnails/007/033/146/small/profile-icon-login-head-icon-vector.jpg"
                    width={210}
                />
                <Textarea
                    placeholder="Username"
                    className="max-w-xs mt-2 mb-2"
                />
                <Textarea
                    isInvalid={false}
                    variant="bordered"
                    placeholder="Password"
                    errorMessage="The description should be at least 255 characters long."
                    className="max-w-xs mt-2 mb-2"
                />
                <Button className="max-w-xs mt-6">
                    Login
                </Button>
            </CardBody>
        </Card>
    );
}
