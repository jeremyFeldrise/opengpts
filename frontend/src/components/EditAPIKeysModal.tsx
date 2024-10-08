import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./dialog"
import { Input } from "./input"
import { Label } from "./label"
import { useMutation, useQuery } from "react-query"
import { getApiKeys, updateKeys } from "../api/api_keys"
import { Button } from "./button";

interface ApiKeys {
    openaiApiKey: string
    anthropicApiKey: string
    ydcApiKey: string
    taviliApiKey: string
}

interface EditAPIKeysModalProps {
    open: boolean
    setOpen: (open: boolean) => void
}

export default function EditAPIKeysModal(props: EditAPIKeysModalProps) {


    const { data: keys, isLoading, isError, refetch } = useQuery<ApiKeys>('projects', getApiKeys, { onSuccess: (data) => { setStrings(data) } })
    const mutation = useMutation({
        mutationFn: (strings: ApiKeys) => updateKeys(strings),
        onSuccess: () => {
            refetch()
        }
    })
    const [strings, setStrings] = useState({
        openaiApiKey: keys?.openaiApiKey || '',
        anthropicApiKey: keys?.anthropicApiKey || '',
        ydcApiKey: keys?.ydcApiKey || '',
        taviliApiKey: keys?.taviliApiKey || ''
    })




    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setStrings(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        // Here you would typically save the changes to your backend or state management system
        console.log('Handle Save key', strings)
        mutation.mutate(strings)
    }

    return (
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 shadow-lg">
            {
                isLoading && <div>Loading...</div>
            }
            {
                isError && <div>Error loading keys</div>
            }
            <DialogHeader>
                <DialogTitle>Epsimo Configuration</DialogTitle>
                <DialogDescription>
                    You can edit your API keys here.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                {Object.entries(strings).map(([key, value]) => (
                    <div key={key} className="grid items-center grid-cols-4 gap-4">
                        <Label htmlFor={key} className="text-right">
                            {/* //Change the key to a more readable format, remove underscore and put a majuscule at the beginning of each word*/}
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })}
                        </Label>
                        <Input
                            id={key}
                            name={key}
                            value={value}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                ))}
            </div>
            <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => props.setOpen(false)}>
                    Cancel
                </Button>
                <Button type="button" onClick={handleSave}>Save changes</Button>
            </DialogFooter>
        </DialogContent>
    )
}