import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { firestore } from '../../firebase/clientApp'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  QuerySnapshot,
  DocumentSnapshot,
} from 'firebase/firestore'

// export type BaseQueryFn<
//   Args = any,
//   Result = unknown,
//   Error = unknown,
//   DefinitionExtraOptions = object,
//   Meta = object
// > = (
//   args: Args,
//   api: BaseQueryApi,
//   extraOptions: DefinitionExtraOptions
// ) => MaybePromise<QueryReturnValue<Result, Error, Meta>>

// export interface BaseQueryApi {
//   signal: AbortSignal
//   abort: (reason?: string) => void
//   dispatch: ThunkDispatch<any, any, any>
//   getState: () => unknown
//   extra: unknown
//   endpoint: string
//   type: 'query' | 'mutation'
//   forced?: boolean
// }

// export type QueryReturnValue<T = unknown, E = unknown, M = unknown> =
//   | {
//       error: E
//       data?: undefined
//       meta?: M
//     }
//   | {
//       error?: undefined
//       data: T
//       meta?: M
//     }

// type MyResponse =
//   | Response
//   | { data: Response; error?: undefined }
//   | { error: unknown; data?: undefined }
//   | null
//   | undefined
const baseQuery = fetchBaseQuery({
  baseUrl: 'fakeUrl',
  fetchFn: async (input: Response) => {
    //input: RequestInfo, init: RequestInit | undefined) => {
    // console.log('INPUT: ', input)
    // console.log('INIT: ', init)
    // console.log('ARGS: ', api)
    // const resErr: MyResponse = { error: {} }
    // const resOk: MyResponse = { data: new Response() }

    const resObj: { data: unknown; id: string }[] = []
    const okStatus = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
    const errStatus = {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    }

    const { url, method, body } = input

    const pathArray = url
      .split('fakeUrl')[1]
      .split('/')
      .filter((p: string) => p.length > 0)

    let isCollection = false
    console.log(pathArray)
    if (pathArray.length === 0) {
      return new Response(
        JSON.stringify({
          error: { message: 'No path to database entered', isError: true },
        }),
        errStatus
      )
    }

    let path = ''
    pathArray.forEach((p: string, index: number) => {
      if (pathArray.length === index + 1) {
        path += p
      } else {
        path += p + '/'
      }
    })

    console.log(path)
    if (pathArray.length % 2 !== 0) {
      isCollection = true
    }

    try {
      switch (method) {
        case 'GET':
          //** Check weather the request is a collection or a document */
          if (isCollection) {
            //** If the query is a collection, get the full collection from the firebase */
            const querySnapshot: QuerySnapshot<unknown> = await getDocs(
              collection(firestore, path)
            )

            // console.log('Collection SnapShot.docs: ', querySnapshot.docs)
            //** Verify that the object exist */
            if (querySnapshot.empty) {
              return new Response(
                JSON.stringify({
                  error: { message: 'collection is Empty', isError: true },
                }),
                errStatus
              )
            }

            //** extract the data from the snapshot object and put it into a new array */
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              const data = doc.data()
              resObj.push({ data: data, id: doc.id.toString() })
              // console.log(doc.id, ' => ', doc.data())
            })

            // console.log(resObj)
            return new Response(JSON.stringify({ data: resObj }), okStatus)
          } else {
            //** If the query is a document, get the document from firebase */
            const snapshot: DocumentSnapshot<unknown> = await getDoc(
              doc(firestore, path)
            )

            //** Check if the document exist */
            if (!snapshot.exists()) {
              return new Response(
                JSON.stringify({
                  error: { message: 'Document does not exist', isError: true },
                }),
                errStatus
              )
            }

            //** Add resObj to resObj array */
            resObj.push({
              data: snapshot.data(),
              id: pathArray[pathArray.length - 1],
            })

            console.log(resObj)
            //** Return the resObj wrapped in a Response object */
            return new Response(JSON.stringify({ data: resObj }), okStatus)
          }

        case 'POST':
          //** Verify that the path is a collection  */
          if (!isCollection) {
            return new Response(
              JSON.stringify({
                error: { message: 'Path must be a collection', isError: true },
              }),
              errStatus
            )
          }

          //** Verify that the body is not empty */
          if (!body) {
            return new Response(
              JSON.stringify({
                error: { message: 'Body must not be empty', isError: true },
              }),
              errStatus
            )
          }

          //** Create a new document with the given BODY */
          const newDoc = await addDoc(collection(firestore, path), body)

          //** Add resObj to the resObj array */
          resObj.push({ data: newDoc, id: newDoc.id.toString() })

          //** Return the resObj wrapped in a Response object */
          return new Response(JSON.stringify({ data: resObj }), okStatus)

        case 'PATCH':
          //** Verify that the path is a document  */
          if (isCollection) {
            return new Response(
              JSON.stringify({
                error: { message: 'Path must be a Document', isError: true },
              }),
              errStatus
            )
          }

          //** Verify that the body is not empty */
          if (!body) {
            return new Response(
              JSON.stringify({
                error: { message: 'Body must not be empty', isError: true },
              }),
              errStatus
            )
          }

          //** Patch document with new data */
          const updatedDoc = await updateDoc(doc(firestore, path), { ...body })

          //** Add resObj to the resObj array and return it */
          return new Response(
            JSON.stringify({
              message: `New Document created with id: ${updatedDoc}`,
            })
          )

        case 'DELETE':
          break
        default:
          return null
      }
    } catch (error) {
      console.log(error)
      return { error }
    }
  },
})

export const apiSlice = createApi({
  baseQuery,
  // tagTypes: ['Shift', 'User'],
  endpoints: () => ({}),
})

// export const { useGetHousesQuery } = apiSlice

// getHouses: builder.query({
//   query: (path) => ({
//     url: `${path}`,
//     method: 'GET',
//   }),
// }),
