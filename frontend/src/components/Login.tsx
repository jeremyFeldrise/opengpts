import { useNavigate } from "react-router-dom";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

import { Layout } from "./Layout";
import { useState } from "react";
import { useThreadAndAssistant } from "../hooks/useThreadAndAssistant";
import { UserAuthForm } from "./UserAuthForm";

function Login() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { assistantConfig } = useThreadAndAssistant();

    return (

        <Layout
            subtitle={
                assistantConfig ? (
                    <span className="inline-flex items-center gap-1">
                        {assistantConfig.name}

                    </span>
                ) : null
            }
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            sidebar={
                null
            }
        >
            <div>
                <UserAuthForm></UserAuthForm>
            </div>
        </Layout>
    )
}

export default Login;