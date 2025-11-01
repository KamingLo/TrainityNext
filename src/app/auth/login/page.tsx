import Link from "next/link";
import Input from "@/components/michael/input";
import Section from "@/components/sections";

export const metadata = { title: "Login" };

export default function LoginPage() {
	return (
		<Section id="Login" className="w-full max-w-md p-8 bg-black rounded-lg shadow-md">
				<h2 className="text-2xl font-bold text-center text-gray-900">Login to Your Account</h2>

				<form className="space-y-4" method="post" action="/api/auth/login">
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
						<Input type="email" name="email" placeholder="you@example.com" showHide={false} />
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
						<Input type="password" name="password" placeholder="••••••••" showHide={true} />
                        <div className="text-right mt-1">
                            <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">Forgot password?</Link>
                        </div>
					</div>

					<div>
						<button
							type="submit"
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							Login
						</button>
					</div>
				</form>

				<p className="text-center text-sm text-gray-600">Don&apos;t have an account? <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">Sign up</Link></p>
		</Section>
	);
}

