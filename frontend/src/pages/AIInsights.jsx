import {
    useEffect,
    useState
} from "react";

import {
    motion
} from "framer-motion";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";

export default function AIInsights() {

    const [insights, setInsights] = useState([]);

    const [loading, setLoading] = useState(false);

    const [pageLoading, setPageLoading] = useState(true);

    const fetchAIInsights = async () => {

        try {

            const response = await API.get(
                "/api/ai-insights"
            );

            setInsights(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setPageLoading(false);

        }

    };

    const generateAIInsights = async () => {

        try {

            setLoading(true);

            await API.post(
                "/api/generate-ai-insights"
            );

            await fetchAIInsights();

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchAIInsights();

    }, []);

    if (pageLoading) {

        return (

            <DashboardLayout>

                <div className="p-10 text-3xl font-bold">

                    Loading AI Insights...

                </div>

            </DashboardLayout>

        );

    }

    return (

        <DashboardLayout>

            <div className="p-6 bg-gray-100 min-h-screen">

                <div className="flex justify-between items-center mb-10">

                    <div>

                        <h1 className="text-4xl font-bold text-gray-800">

                            AI Insights

                        </h1>

                        <p className="text-gray-500 mt-2">

                            AI Generated Trade Intelligence

                        </p>

                    </div>

                    <button
                        onClick={generateAIInsights}
                        disabled={loading}
                        className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 disabled:bg-gray-400"
                    >

                        {
                            loading
                            ? "Generating..."
                            : "Generate AI Insights"
                        }

                    </button>

                </div>

                {
                    insights.length === 0
                    ? (

                        <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500 text-xl">

                            No AI Insights Generated

                        </div>

                    )
                    : (

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {
                                insights.map((item) => (

                                    <motion.div

                                        key={item.id}

                                        initial={{
                                            opacity: 0,
                                            y: 10
                                        }}

                                        animate={{
                                            opacity: 1,
                                            y: 0
                                        }}

                                        transition={{
                                            duration: 0.2
                                        }}

                                        className={`
                                            rounded-3xl p-7 shadow-lg border-l-[10px]
                                            ${
                                                item.insight_type === "payment"
                                                ? "bg-gradient-to-br from-red-50 to-red-100 border-red-500"

                                                : item.insight_type === "revenue"
                                                ? "bg-gradient-to-br from-green-50 to-green-100 border-green-500"

                                                : item.insight_type === "tax"
                                                ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-500"

                                                : "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-500"
                                            }
                                        `}
                                    >

                                        <div className="flex justify-between items-center mb-5">

                                            <h2 className="text-2xl font-bold text-gray-800">

                                                {item.title}

                                            </h2>

                                        </div>

                                        <div className="whitespace-pre-line text-gray-700 leading-6 text-[15px]">

                                            {item.content}

                                        </div>

                                        <div className="mt-6 text-sm text-gray-500">

                                            Generated:

                                            {" "}

                                            {
                                                new Date(
                                                    item.created_at
                                                ).toLocaleString()
                                            }

                                        </div>

                                    </motion.div>

                                ))
                            }

                        </div>

                    )
                }

            </div>

        </DashboardLayout>

    );

}