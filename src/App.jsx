import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Tierlists from "./pages/Tierlists";
import Guides from "./pages/Guides";
import Profile from "./pages/Profile";
import TierlistMaker from "./pages/TierlistMaker";
import Builder from "./pages/Builder";


export default function App() {
	return (
		<div className="min-h-screen bg-[#0b0b0b] text-white">
			<Navbar />


			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/tierlists" element={<Tierlists />} />
				<Route path="/guides" element={<Guides />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/tierlist-maker" element={<TierlistMaker />} />
				<Route path="/builder" element={<Builder />} />
			</Routes>
		</div>
	);
}