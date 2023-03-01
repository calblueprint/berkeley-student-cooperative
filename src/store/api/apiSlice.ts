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

const baseQuery = fetchBaseQuery({
  baseUrl: 'fakeUrl',
  fetchFn: async (input: Request) => {
    console.debug('ARGS: ', input)
    // console.log('ARGS: ', api)

    const { url, method, body } = input
    const pathArray = url
      .split('fakeUrl')[1]
      .split('/')
      .filter((p: string) => p.length > 0)

    let isCollection = false
    // console.log(pathArray)
    if (pathArray.length === 0) {
      return { error: 'Invalid Path' }
    }

    let path = ''
    pathArray.forEach((p: string, index: number) => {
      if (pathArray.length === index + 1) {
        path += p
      } else {
        path += p + '/'
      }
    })

    // console.log(path)
    if (pathArray.length % 2 !== 0) {
      isCollection = true
    }

    const response: { data: unknown; id: string }[] = []
    try {
      switch (method) {
        case 'GET':
          //** Check weather the request is a collection or a document */
          if (isCollection) {
            //** If the query is a collection, get the full collection from the firebase */
            const querySnapshot: QuerySnapshot<unknown> = await getDocs(
              collection(firestore, path)
            )

            console.debug('Collection SnapShot.docs: ', querySnapshot.docs)
            //** Verify that the object exist */
            if (!querySnapshot) return { error: 'collection not found' }

            //** extract the data from the snapshot object and put it into a new array */
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              const data = doc.data()
              response.push({ data: data, id: doc.id.toString() })
              // console.log(doc.id, ' => ', doc.data())
            })

            // console.log(response)
            return new Response(JSON.stringify({ data: response }))
          } else {
            //** If the query is a document, get the document from firebase */
            const snapshot: DocumentSnapshot<unknown> = await getDoc(
              doc(firestore, path)
            )

            //** Check if the document exist */
            if (!snapshot.exists()) {
              return { error: 'Document does not exist' }
            }

            //** Add response to response array */
            response.push({
              data: snapshot.data(),
              id: pathArray[pathArray.length - 1],
            })

            console.log(response)
            //** Return the response wrapped in a Response object */
            return new Response(JSON.stringify({ data: response }))
          }

        case 'POST':
          //** Verify that the path is a collection  */
          if (!isCollection) {
            return { error: 'Path must be a collection' }
          }

          //** Verify that the body is not empty */
          if (!body) return { error: 'Body must not be empty' }

          //** Create a new document with the given BODY */
          const newDoc = await addDoc(collection(firestore, path), body)

          //** Add response to the response array */
          response.push({ data: newDoc, id: newDoc.id.toString() })

          //** Return the response wrapped in a Response object */
          return new Response(JSON.stringify({ data: response }))

        case 'PATCH':
          //** Verify that the path is a document  */
          if (isCollection) {
            return { error: 'Path must be a Document' }
          }

          //** Verify that the body is not empty */
          if (!body) return { error: 'Body must not be empty' }

          //** Patch document with new data */
          const updatedDoc = await updateDoc(doc(firestore, path), { ...body })

          //** Add response to the response array */
          return {
            data: new Response(
              JSON.stringify({
                message: `New Document created with id: ${updatedDoc}`,
              })
            ),
          }

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
  endpoints: (builder) => ({
    getHouses: builder.query({
      query: (path) => ({
        url: `${path}`,
        method: 'GET',
      }),
    }),
  }),
})

export const { useGetHousesQuery } = apiSlice
