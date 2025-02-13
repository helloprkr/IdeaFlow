-- Enable RLS
alter table public.ideas enable row level security;
alter table public.profiles enable row level security;

-- Create ideas table
create table public.ideas (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    description text not null,
    status text not null default 'draft'::text check (status in ('draft', 'in_progress', 'completed')),
    user_id uuid references auth.users(id) on delete cascade not null
);

-- Create profiles table
create table public.profiles (
    id uuid references auth.users(id) primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    username text unique not null,
    full_name text not null,
    avatar_url text,
    website text,
    bio text
);

-- Set up RLS policies for ideas
create policy "Users can view all ideas"
    on ideas for select
    to authenticated
    using (true);

create policy "Users can create their own ideas"
    on ideas for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own ideas"
    on ideas for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own ideas"
    on ideas for delete
    to authenticated
    using (auth.uid() = user_id);

-- Set up RLS policies for profiles
create policy "Users can view all profiles"
    on profiles for select
    to authenticated
    using (true);

create policy "Users can insert their own profile"
    on profiles for insert
    to authenticated
    with check (auth.uid() = id);

create policy "Users can update their own profile"
    on profiles for update
    to authenticated
    using (auth.uid() = id)
    with check (auth.uid() = id);

-- Create function to handle user profile creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id, username, full_name)
    values (
        new.id,
        new.email,  -- Use email as initial username
        coalesce(new.raw_user_meta_data->>'full_name', new.email)  -- Use metadata or fallback to email
    );
    return new;
end;
$$;

-- Create trigger for new user profile creation
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();