import React, { useState } from "react";
import '../styles/sa.css';

const SentimentAnalysis = () => {
    const [bertSentiment, setBertSentiment] = useState(null);
    const [geminiReport, setGeminiReport] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const analyzeSentiment = async () => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("Unauthorized: Please log in.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("https://mentora-backend-w886.onrender.com/analyze_sentiment", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setBertSentiment(data.bert_sentiment);
            setGeminiReport(data.gemini_report);
        } catch (err) {
            console.error("Error fetching sentiment data:", err);
            setError("Failed to fetch sentiment analysis. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Unauthorized: Please log in.");
            return;
        }

        setDownloading(true);

        try {
            const response = await fetch("https://mentora-backend-w886.onrender.com/download_report", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Mentora_Sentiment_Report.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (err) {
            console.error("Error downloading report:", err);
            setError("Failed to download report. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="sentiment-container">
            <h2>Sentiment Analysis</h2>

            <div className="sentiment-description">
                <p>
                    Get powerful insights with the <strong>Mentora Sentiment Report</strong> — including 
                    <strong> BERT scores</strong>, <strong>Gemini AI tips</strong>, and a <strong>7-day mood summary</strong>.
                </p>

                <p className="highlight">
                    <strong>Download your report</strong> for emotional insights with charts and visual summaries. <br />
                    Get personalized, AI-driven wellness suggestions.
                </p>
            </div>

            <div className="button-row">
                <button className="generate-button" onClick={analyzeSentiment} disabled={loading}>
                    {loading ? "Analyzing..." : "Generate Report"}
                </button>

                {loading && <div className="loading-circle-small"></div>}
            </div>

            {error && <p className="error">{error}</p>}

            {(bertSentiment || geminiReport) && (
                <div className="report-container">
                    {bertSentiment && (
                        <div className="sentiment-result">
                            <h3>BERT Sentiment Analysis</h3>
                            <p><strong>Average Score:</strong> {bertSentiment.average_sentiment_score}</p>
                            <p><strong>Label:</strong> {bertSentiment.sentiment_label}</p>
                        </div>
                    )}

                    {geminiReport && (
                        <div className="sentiment-result">
                            <h3>Gemini AI Report</h3>
                            <pre className="gemini-report">{geminiReport}</pre>
                        </div>
                    )}

                    <button className="download-button" onClick={downloadReport} disabled={downloading}>
                        {downloading ? "Downloading..." : "Download Report"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SentimentAnalysis;
