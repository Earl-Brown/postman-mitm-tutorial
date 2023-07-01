const http = require("http")

const mockServer = "802a90a2-d347-45d2-a9fd-f36b5bc78424.mock.pstmn.io"
const fooBarId = "8383545-e61cbe7e-0fd2-4df3-8973-7020157dd5f1"
const barBazId = "8383545-572781a9-2c48-4213-923a-faba4bdca259"

const log = console.log

const server = http.createServer(async (req, res) => {
	log(`handing request ${req.url}`)
	// define the postman mock url path by copying the path and query string 
	//	from the request.  Lucky for us, the "url" part of the incoming request is just that!
	const path = req.url
	const remoteUrl = `https://${mockServer}${path}`		

	// copy all of the headers from the request so that they are sent on to the postman mock server
	//	except replace the "host" header because we're not going to localhost like the request does
	const headers =  {...req.headers, "host": mockServer}

	// and then do a simple comparison
	if (path == "/api?Foo=Bar") {
		headers = {...headers, "x-mock-response-id": fooBarId}
	}
	else if (query == "bar=baz") {
		headers = {...headers, "x-mock-response-id": barBazId}
	}

	// now call Postman
	const proxied = await fetch(remoteUrl, {
		...req,
		headers: headers
	})

	// ... and copy the response from postman to our response
	res.setHeaders(proxied.headers)
	res.statusCode = proxied.status
	res.statusMessage = proxied.statusText
	for await (const chunk of proxied.body) {
		res.write(chunk)
	}	
	res.end()

	/// ... and we're all done!!!
	log(`all done (${proxied.status}: ${proxied.statusText})`)
});

log("listening on port 5050")
server.listen(5050);