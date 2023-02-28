import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { firestore } from '../../firebase/clientApp'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  QuerySnapshot,
  DocumentSnapshot,
} from 'firebase/firestore'

import { MaybePromise } from '@reduxjs/toolkit/dist/query/tsHelpers'
import { ThunkDispatch } from '@reduxjs/toolkit'

export type BaseQueryFn<
  Args = any,
  Result = unknown,
  Error = unknown,
  DefinitionExtraOptions = {},
  Meta = {}
> = (
  args: Args,
  api: BaseQueryApi,
  extraOptions: DefinitionExtraOptions
) => MaybePromise<QueryReturnValue<Result, Error, Meta>>

export interface BaseQueryApi {
  signal: AbortSignal
  abort: (reason?: string) => void
  dispatch: ThunkDispatch<any, any, any>
  getState: () => unknown
  extra: unknown
  endpoint: string
  type: 'query' | 'mutation'
  forced?: boolean
}

export type QueryReturnValue<T = unknown, E = unknown, M = unknown> =
  | {
      error: E
      data?: undefined
      meta?: M
    }
  | {
      error?: undefined
      data: T
      meta?: M
    }

const baseQuery = fetchBaseQuery({
  baseUrl: 'fakeUrl',
  fetchFn: async (input: Request) => {
    console.log('ARGS: ', input)
    // console.log('ARGS: ', api)

    const { url, method } = input
    const pathArray = url
      .split('fakeUrl')[1]
      .split('/')
      .filter((p: string) => p.length > 0)

    let isCollection = false
    console.log(pathArray)
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

    console.log(path)
    if (pathArray.length % 2 !== 0) {
      isCollection = true
    }

    const response: { data: unknown; id: string }[] = []
    setTimeout(() => {
      console.log('waited for 3000ms')
    }, 3000)
    try {
      switch (method) {
        case 'GET':
          // let snapshot: any
          if (isCollection) {
            //** If the query is a collection, get the full collection */
            const querySnapshot: QuerySnapshot<unknown> = await getDocs(
              collection(firestore, path)
            )
            console.log('collection SnapShot', querySnapshot)
            // console.log(querySnapshot.docs)
            if (!querySnapshot) return { error: 'collection not found' }
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              const data = doc.data()
              response.push({ data: data, id: doc.id.toString() })
              console.log(doc.id, ' => ', doc.data())
            })
            console.log(response)
            // return snapshot.map((doc) => ({ id: doc.id, ...doc.data() }))

            return new Response(JSON.stringify({ data: response }))
          } else {
            //** If the query is a document, get the document with id provided */
            const snapshot: DocumentSnapshot<unknown> = await getDoc(
              doc(firestore, path)
            )
            if (!snapshot.exists()) {
              return { error: 'Document does not exist' }
            }
            const data = snapshot.data()
            response.push({ data: data, id: pathArray[pathArray.length - 1] })
            console.log(response)
            return new Response(JSON.stringify({ data: response }))
          }

        // case 'POST':
        //   await query.add(data)
        //   return { data, url: '' }
        // case 'PUT':
        //   await query.set(data)
        //   return { data, url: '' }
        // case 'DELETE':
        //   await query.delete()
        //   return { data, url: '' }
        //     break
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
