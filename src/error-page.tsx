import { isRouteErrorResponse, useRouteError } from "react-router-dom";


// Modeled after React-Router Github recommendation https://github.com/remix-run/react-router/discussions/9628
export function ErrorPage() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        if (error.status === 401) {
            // ...
        }
        else if (error.status === 404) {
            // ...
        }

        return (
            <div id="error-page">
                <h1>Oops! {error.status}</h1>
                <p>{error.statusText}</p>
                {error.data?.message && (
                    <p>
                        <i>{error.data.message}</i>
                    </p>
                )}
            </div>
        );
    } else if (error instanceof Error) {
        return (
            <div id="error-page">
                <h1>Oops! Unexpected Error</h1>
                <p>Something went wrong.</p>
                <p>
                    <i>{error.message}</i>
                </p>
            </div>
        );
    } else {
        return <></>;
    }
}