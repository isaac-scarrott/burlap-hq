type Props = { open: (id: "page2" | "page3") => void };

export default function Home({ open }: Props) {
  return (
    <main className='home flex flex-col gap-4'>
      <h1>Home</h1>
      <button
        className='bg-blue-500 text-white p-2 rounded-md'
        onClick={() => open("page2")}
      >
        Open Page 2
      </button>
      <button
        className='bg-blue-500 text-white p-2 rounded-md'
        onClick={() => open("page3")}
      >
        Open Page 3
      </button>
    </main>
  );
}
