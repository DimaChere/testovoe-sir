"use client";
import {
    HourglassTop,
    HourglassBottom,
    HourglassEmpty,
} from "@mui/icons-material";
import { useEffect, useState } from "react";

export default function TableSkeleton() {
    const [curImg, setCurrentImg] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImg((prev) => (prev + 1) % 3);
        }, 200);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex justify-center items-center w-full">
            {curImg == 0 && <HourglassTop className="text-[#00838F]" />}
            {curImg == 1 && <HourglassBottom className="text-[#00838F]" />}
            {curImg == 2 && <HourglassEmpty className="text-[#00838F]" />}
        </div>
    );
}
