const DATA_REGISTRY_HOST = 'ec2-3-84-156-50.compute-1.amazonaws.com'
const DATA_REGISTRY_PORT = 5000
const ACCESS_TOKEN = 'REGISTY_API_TOKEN'


function apiUrl(){
  return `http://${DATA_REGISTRY_HOST}:${DATA_REGISTRY_PORT}`
}
export async function createResearchRecord(requestRecord){
  fetch(`${apiUrl()}/api/records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access-token": ACCESS_TOKEN,
    },
    body: requestRecord,
  })
}
