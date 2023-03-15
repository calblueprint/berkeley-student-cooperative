import { createApi } from '@reduxjs/toolkit/query/react'
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
import type { BaseQueryFn } from '@reduxjs/toolkit/query'

const customBaseQuery: BaseQueryFn<
  unknown,
  unknown,
  unknown,
  object,
  object
> = async (arg) => {
  // Args
  // console.log(arg)
  const result = async ({
    url,
    method,
    body,
  }: // params,
  {
    url: string
    method: string
    body: object
    // params: object
  }) => {
    // console.log('method: ', method)
    console.log('url: ', url)
    console.log('body to Save: ', body)
    // console.log('params: ', params)

    const pathArray = url.split('/').filter((p: string) => p.length > 0)
    const resObj: unknown[] = []
    let isCollection = false
    // console.log(pathArray)
    if (pathArray.length === 0) {
      return {
        error: { message: 'No path to database entered', isError: true },
      }
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

    try {
      switch (method) {
        case 'GET':
          //** Check weather the request is a collection or a document */
          if (isCollection) {
            //** If the query is a collection, get the full collection from the firebase */
            console.log(path)
            const query = collection(firestore, path)
            const querySnapshot: QuerySnapshot<unknown> = await getDocs(query)

            // console.log('Collection SnapShot.docs: ', querySnapshot.docs)
            //** Verify that the object exist */
            if (querySnapshot.empty) {
              return {
                error: { message: 'collection is Empty', isError: true },
              }
            }

            //** extract the data from the snapshot object and put it into a new array */
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              const data = doc.data()
              // console.log('firebase data: ', data)
              if (data) {
                resObj.push({ id: doc.id.toString(), ...data })
              }
              // console.log(doc.id, ' => ', doc.data())
            })

            // console.log(resObj)
            return { data: resObj }
          } else {
            //** If the query is a document, get the document from firebase */
            const snapshot: DocumentSnapshot<unknown> = await getDoc(
              doc(firestore, path)
            )

            //** Check if the document exist */
            if (!snapshot.exists()) {
              return {
                error: { message: 'Document does not exist', isError: true },
              }
            }

            //** Add resObj to resObj array */
            resObj.push({
              id: pathArray[pathArray.length - 1],
              ...(snapshot.data() ?? null),
            })

            // console.log(resObj)
            //** Return the resObj wrapped in a Response object */
            return { data: resObj }
          }

        case 'POST':
          //** Verify that the path is a collection  */
          if (!isCollection) {
            return {
              error: { message: 'Path must be a collection', isError: true },
            }
          }

          //** Verify that the body is not empty */
          if (!body) {
            return {
              error: { message: 'Body must not be empty', isError: true },
            }
          }

          // const postData = await streamToObject(body)

          //** Create a new document with the given BODY */
          // const newDoc =
          await addDoc(collection(firestore, path), body)
          // console.log(newDoc)
          //** Add resObj to the resObj array */
          // resObj.push({ newDoc.id.toString() })

          //** Return the resObj wrapped in a Response object */
          return { data: 'success' } //resObj }

        case 'PATCH':
          //** Verify that the path is a document  */
          if (isCollection) {
            return {
              error: { message: 'Path must be a Document', isError: true },
            }
          }

          //** Verify that the body is not empty */
          if (!body) {
            return {
              error: { message: 'Body must not be empty', isError: true },
            }
          }

          // const patchData = await streamToObject(body)

          //** Patch document with new data */
          const updatedDoc = await updateDoc(doc(firestore, path), body)

          //** Add resObj to the resObj array and return it */
          return {
            data: {
              message: `New Document created with id: ${updatedDoc}`,
            },
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
  }
  try {
    const res = await result(
      arg as { url: string; method: string; body: object }
    )
    if (res?.data) {
      return { data: res?.data }
    } else {
      return { error: 'error ocurred' }
    }
  } catch (error) {
    return { error }
  }
}

export const apiSlice = createApi({
  baseQuery: customBaseQuery,
  tagTypes: ['Shift', 'User', 'House'],
  endpoints: () => ({}),
})
