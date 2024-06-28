import { Auth } from "../components/Auth"
export const Signup = () => {
    return <div className="h-screen flex justify-center items-center">
        <div className="flex justify-center">
            <div>
                <Auth type="signup" />
            </div>
        </div>
    </div>
}