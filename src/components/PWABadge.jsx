import { useRegisterSW } from "virtual:pwa-register/react";
import { useState } from "react";


export default function PWABadge() {
const {
offlineReady: [offlineReady, setOfflineReady],
needRefresh: [needRefresh, setNeedRefresh],
updateServiceWorker
} = useRegisterSW();


const close = () => {
setOfflineReady(false);
setNeedRefresh(false);
};


if (!offlineReady && !needRefresh) return null;


return (
<div className="fixed bottom-4 right-4 bg-slate-800 px-4 py-3 rounded-lg shadow-lg border border-slate-600">
<div className="text-sm">
{offlineReady ? "App siap digunakan offline" : "Update tersedia"}
</div>


<div className=" flex gap-2 mt-2">
{needRefresh && (
<button
onClick={() => updateServiceWorker(true)}
className="px-2 py-1 bg-blue-600 rounded text-sm"
>
Update
</button>
)}
<button onClick={close} className="px-2 py-1 bg-slate-700 rounded text-sm">
Tutup
</button>
</div>
</div>
);
}